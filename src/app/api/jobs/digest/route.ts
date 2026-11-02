import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, publicJobs } from '@/db/schema';
import { inArray, desc } from 'drizzle-orm';
import { sendJobDigestEmail, DigestJobItem } from '@/lib/email';
import { getSessionFromCookies, isAdminEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const isCronAuthorized = cronSecret && authHeader === `Bearer ${cronSecret}`;

    if (!isCronAuthorized) {
      const session = await getSessionFromCookies();
      if (!session || !isAdminEmail(session.email)) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized to trigger job digest dispatch' },
          { status: 401 }
        );
      }
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, error: 'Database is not configured' },
        { status: 500 }
      );
    }

    const digestUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        frequency: users.jobDigestFrequency,
      })
      .from(users)
      .where(inArray(users.jobDigestFrequency, ['weekly', 'monthly']));

    if (digestUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users currently opted in to email digests',
        sentCount: 0,
      });
    }

    const recentJobs = await db
      .select({
        company: publicJobs.company,
        role: publicJobs.role,
        location: publicJobs.location,
        link: publicJobs.link,
      })
      .from(publicJobs)
      .orderBy(desc(publicJobs.createdAt))
      .limit(6);

    const formattedJobs: DigestJobItem[] = recentJobs.map((j) => ({
      company: j.company,
      role: j.role,
      location: j.location,
      link: j.link,
    }));

    if (formattedJobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No recent jobs available to dispatch in digest',
        sentCount: 0,
      });
    }

    const origin =
      request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://jobradar.app';
    const dashboardUrl = `${origin}/dashboard`;

    let sentCount = 0;
    for (const u of digestUsers) {
      const freq = u.frequency as 'weekly' | 'monthly';
      const result = await sendJobDigestEmail({
        to: u.email,
        userName: u.name || undefined,
        frequency: freq,
        jobs: formattedJobs,
        dashboardUrl,
      });
      if (result.success) {
        sentCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Digest dispatched to ${sentCount} user(s)`,
      sentCount,
    });
  } catch (err: unknown) {
    console.error('Job digest dispatch error:', err);
    const errorMsg = err instanceof Error ? err.message : 'Failed to dispatch digests';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
