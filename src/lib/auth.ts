import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_super_secret_job_radar_key_minimum_32_characters'
);

export const AUTH_COOKIE_NAME = 'auth_token';

export interface UserSession {
  sub: string;
  email: string;
  name: string;
  image?: string;
}

/**
 * Creates and signs a 30-day JWT session token
 */
export async function createSessionToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

/**
 * Verifies and decodes a JWT session token
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      image: payload.image as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Checks if an email is authorized to access the personal dashboard
 */
export function isAllowedEmail(email: string): boolean {
  const allowed = process.env.ALLOWED_EMAIL;
  if (!allowed) {
    // If ALLOWED_EMAIL is not configured yet in local development, allow for testing
    console.warn('ALLOWED_EMAIL is not set in environment variables.');
    return true;
  }
  return email.toLowerCase() === allowed.toLowerCase();
}
