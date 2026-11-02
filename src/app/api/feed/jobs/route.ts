import { NextResponse } from 'next/server';
import { db } from '@/db';
import { publicJobs, jobs } from '@/db/schema';
import { desc, eq, ilike, or } from 'drizzle-orm';
import { getSessionFromCookies } from '@/lib/auth';
import { processJobLink } from '@/lib/ingestion';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';

    const session = await getSessionFromCookies();
    const userId = session?.sub;

    let query = db.select().from(publicJobs);

    if (search) {
      const searchPattern = `%${search}%`;
      query = db
        .select()
        .from(publicJobs)
        .where(
          or(
            ilike(publicJobs.company, searchPattern),
            ilike(publicJobs.role, searchPattern),
            ilike(publicJobs.location, searchPattern)
          )
        ) as typeof query;
    }

    const allPublicJobs = await query.orderBy(desc(publicJobs.createdAt));

    let trackedLinks = new Set<string>();
    if (userId) {
      const userTracked = await db
        .select({ link: jobs.link })
        .from(jobs)
        .where(eq(jobs.userId, userId));
      trackedLinks = new Set(userTracked.map((j) => j.link));
    }

    const enrichedJobs = allPublicJobs.map((pj) => ({
      ...pj,
      isTracked: trackedLinks.has(pj.link),
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          jobs: enrichedJobs,
          total: enrichedJobs.length,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/feed/jobs GET Error]:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch public feed jobs' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { message: 'Admin access required to post public jobs' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { link, company, role, location = 'N/A', exp = 'N/A' } = body;

    if (!link) {
      return NextResponse.json(
        { success: false, error: { message: 'Job link is required' } },
        { status: 400 }
      );
    }

    if (company && role) {
      const inserted = await db
        .insert(publicJobs)
        .values({
          company,
          role,
          link,
          location,
          exp,
          source: 'admin',
          postedBy: session.sub,
        })
        .returning();

      return NextResponse.json({ success: true, data: inserted[0] });
    }

    const result = await processJobLink(link, 'admin', session.sub, 'public');
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('[API /api/feed/jobs POST Error]:', error);
    const errCode = (error as { code?: string })?.code;
    if (errCode === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'DUPLICATE', message: 'Job link already exists in the public feed' },
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create public feed job' } },
      { status: 500 }
    );
  }
}
