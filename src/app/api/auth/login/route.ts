import { NextResponse } from 'next/server';
import { createSessionToken, verifyCredentials, isAdminEmail, AUTH_COOKIE_NAME } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const check = verifyCredentials(trimmedEmail, password);
    if (!check.valid) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 401 });
    }

    const role = isAdminEmail(trimmedEmail) ? 'admin' : 'user';
    let userId = 'personal-owner-id';
    try {
      if (process.env.DATABASE_URL) {
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, trimmedEmail))
          .limit(1);
        if (existingUsers.length > 0) {
          userId = existingUsers[0].id;
          if (existingUsers[0].role !== role) {
            await db.update(users).set({ role }).where(eq(users.id, userId));
          }
        } else {
          const newRecords = await db
            .insert(users)
            .values({
              email: trimmedEmail,
              name: trimmedEmail.split('@')[0],
              role,
            })
            .returning({ id: users.id });
          if (newRecords.length > 0) {
            userId = newRecords[0].id;
          }
        }
      }
    } catch (dbErr) {
      console.warn('Database user sync skipped:', dbErr);
    }

    const sessionToken = await createSessionToken({
      sub: userId,
      email: trimmedEmail,
      name: trimmedEmail.split('@')[0],
      role,
    });

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
    console.error('Login error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal authentication error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
