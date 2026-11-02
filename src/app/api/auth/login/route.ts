import { NextResponse } from 'next/server';
import {
  createSessionToken,
  comparePassword,
  verifyCredentials,
  isAdminEmail,
  isAllowedEmail,
  AUTH_COOKIE_NAME,
} from '@/lib/auth';
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

    if (!isAllowedEmail(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'This email is not authorized on this private workspace.' },
        { status: 403 }
      );
    }

    let userId = 'personal-owner-id';
    let userRole = isAdminEmail(trimmedEmail) ? 'admin' : 'user';
    let userName = trimmedEmail.split('@')[0];

    try {
      if (process.env.DATABASE_URL) {
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, trimmedEmail))
          .limit(1);

        if (existingUsers.length > 0) {
          const user = existingUsers[0];
          userId = user.id;
          userName = user.name || userName;
          userRole = isAdminEmail(trimmedEmail) ? 'admin' : user.role;

          if (user.passwordHash) {
            const matches = await comparePassword(password, user.passwordHash);
            if (!matches) {
              return NextResponse.json(
                { success: false, error: 'Incorrect password. Please try again.' },
                { status: 401 }
              );
            }
          } else {
            const fallbackCheck = verifyCredentials(trimmedEmail, password);
            if (!fallbackCheck.valid) {
              return NextResponse.json(
                { success: false, error: fallbackCheck.reason },
                { status: 401 }
              );
            }
          }
        } else {
          const fallbackCheck = verifyCredentials(trimmedEmail, password);
          if (!fallbackCheck.valid) {
            return NextResponse.json(
              { success: false, error: fallbackCheck.reason },
              { status: 401 }
            );
          }

          const newRecords = await db
            .insert(users)
            .values({
              email: trimmedEmail,
              name: userName,
              role: userRole,
            })
            .returning({ id: users.id });

          if (newRecords.length > 0) {
            userId = newRecords[0].id;
          }
        }
      } else {
        const fallbackCheck = verifyCredentials(trimmedEmail, password);
        if (!fallbackCheck.valid) {
          return NextResponse.json(
            { success: false, error: fallbackCheck.reason },
            { status: 401 }
          );
        }
      }
    } catch (dbErr) {
      console.warn('Database user lookup skipped:', dbErr);
    }

    const sessionToken = await createSessionToken({
      sub: userId,
      email: trimmedEmail,
      name: userName,
      role: userRole,
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
