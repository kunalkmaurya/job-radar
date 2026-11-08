import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Session expired' } },
        { status: 401 }
      );
    }

    let jobDigestFrequency = 'none';

    if (process.env.DATABASE_URL) {
      const dbUsers = await db
        .select({
          jobDigestFrequency: users.jobDigestFrequency,
          name: users.name,
        })
        .from(users)
        .where(eq(users.email, session.email))
        .limit(1);

      if (dbUsers.length > 0) {
        jobDigestFrequency = dbUsers[0].jobDigestFrequency || 'none';
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...session,
        jobDigestFrequency,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch user';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
    }

    const body = await request.json();
    const { jobDigestFrequency, name } = body;

    const validFrequencies = ['none', 'weekly', 'monthly'];
    if (jobDigestFrequency && !validFrequencies.includes(jobDigestFrequency)) {
      return NextResponse.json(
        { success: false, error: 'Invalid digest frequency. Choose none, weekly, or monthly.' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      const updateData: { jobDigestFrequency?: string; name?: string; updatedAt: Date } = {
        updatedAt: new Date(),
      };
      if (jobDigestFrequency) updateData.jobDigestFrequency = jobDigestFrequency;
      if (name && typeof name === 'string' && name.trim()) updateData.name = name.trim();

      await db.update(users).set(updateData).where(eq(users.email, session.email));
    }

    return NextResponse.json({
      success: true,
      message: 'Profile preferences updated',
      data: { jobDigestFrequency, name },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update preferences';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
