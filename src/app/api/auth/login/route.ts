import { NextResponse } from 'next/server';
import { createSessionToken, verifyCredentials, AUTH_COOKIE_NAME } from '@/lib/auth';
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
      return NextResponse.json(
        { success: false, error: check.reason },
        { status: 401 }
      );
    }

    // Upsert or retrieve user in Neon PostgreSQL
    let userId = 'personal-owner-id';
    try {
      if (process.env.DATABASE_URL) {
        const existingUsers = await db.select().from(users).where(eq(users.email, trimmedEmail)).limit(1);
        if (existingUsers.length > 0) {
          userId = existingUsers[0].id;
        } else {
          const newRecords = await db.insert(users).values({
            email: trimmedEmail,
            name: trimmedEmail.split('@')[0],
          }).returning({ id: users.id });
          if (newRecords.length > 0) {
            userId = newRecords[0].id;
          }
        }
      }
    } catch (dbErr) {
      console.warn('Database user sync skipped:', dbErr);
    }

    // Generate signed 30-day JWT session token
    const sessionToken = await createSessionToken({
      sub: userId,
      email: trimmedEmail,
      name: trimmedEmail.split('@')[0],
    });

    // Set secure HttpOnly cookie
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
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal authentication error' },
      { status: 500 }
    );
  }
}
