import { NextResponse } from 'next/server';
import { createPasswordResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, error: 'Database is not configured for password resets.' },
        { status: 500 }
      );
    }

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, trimmedEmail))
      .limit(1);

    if (existingUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    }

    const user = existingUsers[0];
    const resetToken = await createPasswordResetToken(trimmedEmail, user.id);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db
      .update(users)
      .set({
        resetPasswordToken: resetToken,
        resetPasswordExpires: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    const origin =
      request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(resetToken)}`;

    const emailResult = await sendPasswordResetEmail({
      to: trimmedEmail,
      resetUrl,
      userName: user.name || undefined,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Failed to dispatch reset email via Resend.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (err: unknown) {
    console.error('Forgot password error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Error requesting password reset';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
