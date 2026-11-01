import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_super_secret_job_radar_key_minimum_32_characters'
);

export const AUTH_COOKIE_NAME = 'auth_token';

export interface UserSession {
  sub: string;
  email: string;
  name: string;
  image?: string;
  role?: string;
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
    const email = (payload.email as string) || '';
    const assignedRole = (payload.role as string) || 'user';
    const finalRole = isAdminEmail(email) ? 'admin' : assignedRole;
    return {
      sub: payload.sub as string,
      email,
      name: payload.name as string,
      image: payload.image as string | undefined,
      role: finalRole,
    };
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the current session from request cookies
 */
export async function getSessionFromCookies(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Checks if an email is an administrator
 */
export function isAdminEmail(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  if (clean === 'kunalkrraj@gmail.com') return true;
  const adminEmails = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS;
  if (adminEmails) {
    const list = adminEmails.split(',').map((e) => e.trim().toLowerCase());
    return list.includes(clean);
  }
  const allowed = process.env.ALLOWED_EMAIL || process.env.ALLOWED_EMAILS;
  if (allowed) {
    const first = allowed.split(',')[0]?.trim().toLowerCase();
    return first === clean;
  }
  return false;
}

/**
 * Checks if an email is authorized to access the dashboard (supports single or comma-separated emails, or '*' for open access)
 */
export function isAllowedEmail(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase().replace(/['"]/g, '');
  if (isAdminEmail(clean)) {
    return true;
  }
  const rawAllowed = process.env.ALLOWED_EMAIL || process.env.ALLOWED_EMAILS;
  if (!rawAllowed) {
    return true;
  }
  const allowed = rawAllowed.replace(/['"]/g, '').trim();
  if (!allowed || allowed === '*' || allowed.toLowerCase() === 'all') {
    return true;
  }
  const allowedList = allowed
    .split(',')
    .map((e) => e.trim().toLowerCase().replace(/['"]/g, ''))
    .filter(Boolean);

  if (allowedList.includes('*') || allowedList.includes('all')) {
    return true;
  }

  return allowedList.includes(clean);
}

/**
 * Verifies email and password credentials for direct login
 */
export function verifyCredentials(
  email: string,
  password: string
): { valid: boolean; reason?: string } {
  if (!isAllowedEmail(email)) {
    return { valid: false, reason: 'This email is not authorized on this private workspace.' };
  }

  const expectedPassword = process.env.AUTH_PASSWORD || process.env.ADMIN_PASSWORD || 'radar@2026';
  if (password !== expectedPassword) {
    return { valid: false, reason: 'Incorrect password. Please try again.' };
  }

  return { valid: true };
}
