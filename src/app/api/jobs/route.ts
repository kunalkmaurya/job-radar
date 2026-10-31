import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { desc, eq, and, gte, isNull, or, isNotNull } from 'drizzle-orm';
import { processJobLink } from '@/lib/ingestion';
import { getSessionFromCookies, isAdminEmail } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies();
    const isUserAdmin = !session || session.role === 'admin' || isAdminEmail(session?.email || '');

    if (session?.sub && isUserAdmin) {
      try {
        await db.update(jobs).set({ userId: session.sub }).where(isNull(jobs.userId));
      } catch {
        // Safe fallback for unassigned rows
      }
    }

    const { searchParams } = new URL(request.url);
    const timeline = searchParams.get('timeline') || 'all';
    const status = searchParams.get('status');

    let userCondition;
    if (!session) {
      userCondition = or(isNull(jobs.userId), isNotNull(jobs.id));
    } else if (isUserAdmin) {
      userCondition = or(eq(jobs.userId, session.sub), isNull(jobs.userId));
    } else {
      userCondition = eq(jobs.userId, session.sub);
    }

    const conditions = [userCondition];

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

    const result = await db
      .select()
      .from(jobs)
      .where(and(...conditions))
      .orderBy(desc(jobs.createdAt));

    return NextResponse.json(
      {
        success: true,
        data: { jobs: result, total: result.length },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
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
    const session = await getSessionFromCookies();
    const userId = session?.sub || null;

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
      publicJobId,
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
          userId,
          publicJobId: publicJobId || null,
        })
        .returning();

      return NextResponse.json({ success: true, data: inserted[0] });
    }

    const result = await processJobLink(link, 'manual', userId || undefined, 'personal');
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
