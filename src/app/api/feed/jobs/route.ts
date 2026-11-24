import { NextResponse } from 'next/server';
import { db } from '@/db';
import { publicJobs, jobs, workspaceMembers, workspaces } from '@/db/schema';
import { desc, eq, ilike, or, isNull, and, count } from 'drizzle-orm';
import { getSessionFromCookies } from '@/lib/auth';
import { processJobLink } from '@/lib/ingestion';
import { getOrCreateUserPod, deletePodJob } from '@/lib/workspace';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const feedType = searchParams.get('feedType') || 'pod';

    const session = await getSessionFromCookies();
    const userId = session?.sub;

    let userWorkspaceId: string | null = null;
    let userPodName: string | null = null;
    if (userId) {
      const [membership] = await db
        .select({
          workspaceId: workspaceMembers.workspaceId,
          workspaceName: workspaces.name,
        })
        .from(workspaceMembers)
        .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
        .where(eq(workspaceMembers.userId, userId))
        .limit(1);
      if (membership) {
        userWorkspaceId = membership.workspaceId;
        userPodName = membership.workspaceName;
      }
    }

    const [publicCountRes] = await db
      .select({ count: count() })
      .from(publicJobs)
      .where(isNull(publicJobs.workspaceId));

    let podCount = 0;
    if (userWorkspaceId) {
      const [podCountRes] = await db
        .select({ count: count() })
        .from(publicJobs)
        .where(eq(publicJobs.workspaceId, userWorkspaceId));
      podCount = Number(podCountRes?.count || 0);
    }

    const publicCount = Number(publicCountRes?.count || 0);

    let scopeCondition;
    if (feedType === 'public') {
      scopeCondition = isNull(publicJobs.workspaceId);
    } else {
      if (!userWorkspaceId) {
        return NextResponse.json(
          {
            success: true,
            data: {
              jobs: [],
              total: 0,
              userWorkspaceId: null,
              userPodName: null,
              podCount: 0,
              publicCount,
            },
          },
          { headers: { 'Cache-Control': 'no-store' } }
        );
      }
      scopeCondition = eq(publicJobs.workspaceId, userWorkspaceId);
    }

    const conditions = search
      ? and(
          scopeCondition,
          or(
            ilike(publicJobs.company, `%${search}%`),
            ilike(publicJobs.role, `%${search}%`),
            ilike(publicJobs.location, `%${search}%`)
          )
        )
      : scopeCondition;

    const filteredJobs = await db
      .select()
      .from(publicJobs)
      .where(conditions)
      .orderBy(desc(publicJobs.createdAt));

    let trackedLinks = new Set<string>();
    if (userId) {
      const userTracked = await db
        .select({ link: jobs.link })
        .from(jobs)
        .where(eq(jobs.userId, userId));
      trackedLinks = new Set(userTracked.map((j) => j.link));
    }

    const enrichedJobs = filteredJobs.map((pj) => ({
      ...pj,
      isTracked: trackedLinks.has(pj.link),
      isPodJob: Boolean(userWorkspaceId && pj.workspaceId === userWorkspaceId),
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          jobs: enrichedJobs,
          total: enrichedJobs.length,
          userWorkspaceId,
          userPodName,
          podCount,
          publicCount,
        },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[API /api/feed/jobs GET Error]:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch feed jobs' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json(
        { success: false, error: { message: 'Sign in required to share jobs' } },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { link, company, role, location = 'N/A', exp = 'N/A' } = body;

    if (!link || typeof link !== 'string') {
      return NextResponse.json(
        { success: false, error: { message: 'Job link is required' } },
        { status: 400 }
      );
    }

    const isGlobal = session.role === 'admin' && Boolean(body.isGlobalAdmin);
    let targetWorkspaceId: string | null = null;
    let submittedByName: string | null = null;

    if (isGlobal) {
      targetWorkspaceId = null;
      submittedByName = null;
    } else {
      const pod = await getOrCreateUserPod(session.sub, session.name);
      if (!pod) {
        return NextResponse.json(
          { success: false, error: { message: 'You must belong to a pod to share jobs' } },
          { status: 400 }
        );
      }
      targetWorkspaceId = pod.id;
      submittedByName = session.name || 'Pod Member';
    }

    const source = isGlobal ? 'admin' : 'manual';

    if (company && role) {
      const inserted = await db
        .insert(publicJobs)
        .values({
          company,
          role,
          link: link.trim(),
          location: location && location !== 'N/A' ? location : 'Remote / Flexible',
          exp: exp && exp !== 'N/A' ? exp : 'All Levels',
          source,
          postedBy: session.sub,
          workspaceId: targetWorkspaceId,
          submittedByName,
        })
        .returning();

      return NextResponse.json({ success: true, data: inserted[0] });
    }

    const result = await processJobLink(
      link.trim(),
      source,
      session.sub,
      'public',
      targetWorkspaceId || undefined,
      submittedByName || undefined
    );
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('[API /api/feed/jobs POST Error]:', error);
    const errCode = (error as { code?: string })?.code;
    if (errCode === '23505') {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'DUPLICATE', message: 'Job link already exists in the feed' },
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: { message: 'Failed to share feed job' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Missing job id' }, { status: 400 });
    }

    const res = await deletePodJob(jobId, session.sub);
    return NextResponse.json(res);
  } catch (error: unknown) {
    console.error('[API /api/feed/jobs DELETE Error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete job' }, { status: 500 });
  }
}
