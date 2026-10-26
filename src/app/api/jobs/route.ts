import { NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { desc, eq, and, gte } from 'drizzle-orm';
import { processJobLink } from '@/lib/ingestion';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeline = searchParams.get('timeline') || 'all';
    const status = searchParams.get('status');

    let conditions = [];

    // Status filter
    if (status) {
      conditions.push(eq(jobs.status, status));
    }

    // Timeline filter
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

    const result = conditions.length > 0
      ? await db.select().from(jobs).where(and(...conditions)).orderBy(desc(jobs.createdAt))
      : await db.select().from(jobs).orderBy(desc(jobs.createdAt));

    return NextResponse.json({
      success: true,
      data: { jobs: result, total: result.length },
    });
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

    // If company and role are provided, save directly
    if (company && role) {
      const inserted = await db.insert(jobs).values({
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
      }).returning();

      return NextResponse.json({ success: true, data: inserted[0] });
    }

    // Otherwise, run through ingestion pipeline (scrape + AI)
    const result = await processJobLink(link, 'manual');
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[API /api/jobs POST Error]:', error);
    if (error?.code === '23505') {
      return NextResponse.json(
        { success: false, error: { code: 'DUPLICATE', message: 'Job link already exists in your board.' } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create job' } },
      { status: 500 }
    );
  }
}
