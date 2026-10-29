import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { desc, eq, and, gte, max, count } from 'drizzle-orm';
import { processJobLink } from '@/lib/ingestion';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeline = searchParams.get('timeline') || 'all';
    const status = searchParams.get('status');

    const conditions = [];

    if (status) {
      conditions.push(eq(jobs.status, status));
    }

    const now = new Date();
    if (timeline === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      conditions.push(gte(jobs.createdAt, today));
    } else if (timeline === 'this_week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      conditions.push(gte(jobs.createdAt, oneWeekAgo));
    } else if (timeline === 'past_30_days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      conditions.push(gte(jobs.createdAt, thirtyDaysAgo));
    }

    const [meta] =
      conditions.length > 0
        ? await db
            .select({ lastUpdated: max(jobs.updatedAt), total: count() })
            .from(jobs)
            .where(and(...conditions))
        : await db.select({ lastUpdated: max(jobs.updatedAt), total: count() }).from(jobs);

    const lastUpdatedTs = meta?.lastUpdated ? new Date(meta.lastUpdated).getTime() : 0;
    const totalCount = meta?.total ?? 0;
    const etag = `W/"${totalCount}-${lastUpdatedTs}"`;

    const clientEtag = request.headers.get('if-none-match');
    if (clientEtag && clientEtag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          'Cache-Control': 'private, no-cache',
        },
      });
    }

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(jobs)
            .where(and(...conditions))
            .orderBy(desc(jobs.createdAt))
        : await db.select().from(jobs).orderBy(desc(jobs.createdAt));

    return NextResponse.json(
      {
        success: true,
        data: { jobs: result, total: result.length },
      },
      {
        headers: {
          ETag: etag,
          'Cache-Control': 'private, no-cache',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/jobs GET Error]:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch jobs' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      link,
      company,
      role,
      status = 'Saved',
      notes = '',
      referralStatus = 'none',
      referrerName = '',
      referrerContact = '',
      referralNotes = '',
    } = body;

    if (!link) {
      return NextResponse.json(
        { success: false, error: { message: 'Link is required' } },
        { status: 400 }
      );
    }

    if (company && role) {
      const inserted = await db
        .insert(jobs)
        .values({
          company,
          role,
          link,
          status,
          notes,
          referralStatus,
          referrerName: referrerName || null,
          referrerContact: referrerContact || null,
          referralNotes,
          source: 'manual',
        })
        .returning();

      return NextResponse.json({ success: true, data: inserted[0] });
    }

    const result = await processJobLink(link, 'manual');
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('[API /api/jobs POST Error]:', error);
    const errCode = (error as { code?: string })?.code;
    if (errCode === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'DUPLICATE', message: 'Job link already exists in your board.' },
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create job' } },
      { status: 500 }
    );
  }
}
