import { NextResponse } from 'next/server';
import { createSessionToken, isAllowedEmail, isAdminEmail, AUTH_COOKIE_NAME } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto =
    request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  const appUrl = host
    ? `${proto}://${host}`
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/api/auth/callback`;

  if (error || !code) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${appUrl}/login?error=OAuthFailed`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Failed to exchange code for token:', tokenData);
      return NextResponse.redirect(`${appUrl}/login?error=TokenExchangeFailed`);
    }

    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userinfoResponse.json();

    if (!userinfoResponse.ok || !googleUser.email) {
      console.error('Failed to fetch user info:', googleUser);
      return NextResponse.redirect(`${appUrl}/login?error=FetchProfileFailed`);
    }

    if (!isAllowedEmail(googleUser.email)) {
      console.warn(`Unauthorized login attempt by ${googleUser.email}`);
      return NextResponse.redirect(`${appUrl}/login?error=UnauthorizedAccount`);
    }

    let userId = googleUser.sub;
    try {
      if (process.env.DATABASE_URL) {
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, googleUser.email))
          .limit(1);
        if (existingUsers.length > 0) {
          userId = existingUsers[0].id;
          await db
            .update(users)
            .set({
              name: googleUser.name,
              image: googleUser.picture,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        } else {
          const newRecords = await db
            .insert(users)
            .values({
              email: googleUser.email,
              name: googleUser.name,
              image: googleUser.picture,
            })
            .returning({ id: users.id });
          if (newRecords.length > 0) {
            userId = newRecords[0].id;
          }
        }
      }
    } catch (dbErr) {
      console.warn('Could not upsert user to database:', dbErr);
    }

    const role = isAdminEmail(googleUser.email) ? 'admin' : 'user';
    const sessionToken = await createSessionToken({
      sub: userId,
      email: googleUser.email,
      name: googleUser.name || 'User',
      image: googleUser.picture,
      role,
    });

    const response = NextResponse.redirect(`${appUrl}/dashboard`);
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
  } catch (err) {
    console.error('Unexpected error in Google OAuth callback:', err);
    return NextResponse.redirect(`${appUrl}/login?error=UnexpectedError`);
  }
}
