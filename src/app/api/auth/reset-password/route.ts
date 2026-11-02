import { NextResponse } from 'next/server';
import { verifyPasswordResetToken, hashPassword } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Reset token is required.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const tokenPayload = await verifyPasswordResetToken(token);
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired password reset link.' },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, error: 'Database is not configured for password resets.' },
        { status: 500 }
      );
    }

    const matchedUsers = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, token))
      .limit(1);

    if (matchedUsers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Reset token is invalid or has already been used.' },
        { status: 400 }
      );
    }

    const user = matchedUsers[0];

    if (user.resetPasswordExpires && new Date(user.resetPasswordExpires) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Reset token has expired. Please request a new link.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await db
      .update(users)
      .set({
        passwordHash: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully. You can now sign in.',
    });
  } catch (err: unknown) {
    console.error('Reset password error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Error resetting password';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
