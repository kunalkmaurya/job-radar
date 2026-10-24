import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // In build or test environments without an active DATABASE_URL, fallback gracefully
  console.warn('DATABASE_URL is not set. Database operations will fail at runtime.');
}

// Neon HTTP Serverless Connection (Zero Cold-Start)
const sql = neon(connectionString || '');
export const db = drizzle(sql, { schema });
