import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { scrapeJobPage } from './scraper';
import { extractJobDetails } from './ai';

/**
 * Extracts all URLs from a text string
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex) || [];
  // Clean trailing punctuation commonly attached in chat messages
  return matches.map((u) => u.replace(/[.,;:)]+$/, ''));
}

/**
 * Core Ingestion Pipeline
 * 1. Validates and normalizes URL
 * 2. Checks for duplicates in Neon DB
 * 3. Scrapes content (Jina Reader / Direct)
 * 4. Extracts details with AI (DeepSeek / OpenAI)
 * 5. Inserts into Neon PostgreSQL
 */
export async function processJobLink(
  rawUrl: string,
  source: 'telegram' | 'manual' | 'bookmarklet' = 'telegram'
) {
  try {
    const url = rawUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.warn(`[Ingestion] Invalid URL skipped: ${url}`);
      return null;
    }

    console.log(`[Ingestion] Processing job link from ${source}: ${url}`);

    // 1. De-duplication Check
    const existing = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.link, url))
      .limit(1);

    if (existing.length > 0) {
      console.log(`[Ingestion] Duplicate link already exists in DB. Skipping: ${url}`);
      return { duplicate: true, id: existing[0].id };
    }

    // 2. Scrape job page
    console.log(`[Ingestion] Scraping content for ${url}...`);
    const scraped = await scrapeJobPage(url);

    // 3. AI Extraction
    console.log(`[Ingestion] Extracting details with AI...`);
    const extracted = await extractJobDetails(scraped.text, url, scraped.isFallback);
    console.log(`[Ingestion] Extracted: ${extracted.company} — ${extracted.role}`);

    // 4. Insert into Neon DB
    const inserted = await db
      .insert(jobs)
      .values({
        company: extracted.company,
        role: extracted.role,
        link: url,
        location: extracted.location || 'N/A',
        exp: extracted.exp || 'N/A',
        status: 'Saved',
        notes: '',
        source,
      })
      .returning();

    console.log(`[Ingestion] Successfully saved to Neon DB with ID: ${inserted[0]?.id}`);
    return { success: true, job: inserted[0] };
  } catch (error) {
    console.error(`[Ingestion Error for ${rawUrl}]:`, error);
    throw error;
  }
}
