import { NextResponse } from 'next/server';
import { db } from '@/db';
import { publicJobs, jobs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json(
        { success: false, error: { message: 'Authentication required to track jobs' } },
        { status: 401 }
      );
    }

    const { id } = await params;

    const publicJob = await db.select().from(publicJobs).where(eq(publicJobs.id, id)).limit(1);

    if (publicJob.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Public job not found' } },
        { status: 404 }
      );
    }

    const target = publicJob[0];

    const inserted = await db
      .insert(jobs)
      .values({
        publicJobId: target.id,
        company: target.company,
        role: target.role,
        link: target.link,
        location: target.location,
        exp: target.exp,
        status: 'Saved',
        source: 'feed',
        userId: session.sub,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Job successfully added to your personal dashboard',
      data: inserted[0],
    });
  } catch (error: unknown) {
    console.error('[API /api/feed/jobs/[id]/track Error]:', error);
    const errCode = (error as { code?: string })?.code;
    if (errCode === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'DUPLICATE', message: 'You are already tracking this job' },
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: 'Failed to track job' } },
      { status: 500 }
    );
  }
}
