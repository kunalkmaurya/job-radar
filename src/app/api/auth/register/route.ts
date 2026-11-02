import { NextResponse } from 'next/server';
import {
  createSessionToken,
  hashPassword,
  isAdminEmail,
  isAllowedEmail,
  AUTH_COOKIE_NAME,
} from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isAllowedEmail(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'This email is not authorized on this private workspace.' },
        { status: 403 }
      );
    }

    const role = isAdminEmail(trimmedEmail) ? 'admin' : 'user';
    const displayName =
      (name && typeof name === 'string' && name.trim()) || trimmedEmail.split('@')[0];
    const hashedPassword = await hashPassword(password);

    let userId = 'user_' + Date.now();

    if (process.env.DATABASE_URL) {
      const existing = await db.select().from(users).where(eq(users.email, trimmedEmail)).limit(1);

      if (existing.length > 0) {
        const existingUser = existing[0];
        if (existingUser.passwordHash) {
          return NextResponse.json(
            { success: false, error: 'An account with this email already exists. Please sign in.' },
            { status: 409 }
          );
        }

        await db
          .update(users)
          .set({
            passwordHash: hashedPassword,
            name: existingUser.name || displayName,
            role: isAdminEmail(trimmedEmail) ? 'admin' : existingUser.role,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingUser.id));

        userId = existingUser.id;
      } else {
        const inserted = await db
          .insert(users)
          .values({
            email: trimmedEmail,
            name: displayName,
            role,
            passwordHash: hashedPassword,
          })
          .returning({ id: users.id });

        if (inserted.length > 0) {
          userId = inserted[0].id;
        }
      }
    }

    const sessionToken = await createSessionToken({
      sub: userId,
      email: trimmedEmail,
      name: displayName,
      role,
    });

    const origin =
      request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const dashboardUrl = `${origin}/dashboard`;

    try {
      if (typeof sendWelcomeEmail === 'function') {
        sendWelcomeEmail({
          to: trimmedEmail,
          userName: displayName,
          dashboardUrl,
        }).catch((emailErr) => {
          console.warn('Welcome email dispatch skipped:', emailErr);
        });
      }
    } catch (emailDispatchErr) {
      console.warn('Welcome email trigger failed:', emailDispatchErr);
    }

    const response = NextResponse.json({
      success: true,
      redirect: '/dashboard',
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err: unknown) {
    console.error('Registration error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
