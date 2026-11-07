import { db } from '@/db';
import { jobs, publicJobs } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { scrapeJobPage } from './scraper';
import { extractJobDetails } from './ai';

/**
 * Extracts all URLs from a text string
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex) || [];
  return matches.map((u) => u.replace(/[.,;:)]+$/, ''));
}

/**
 * Core Ingestion Pipeline
 * Supports both personal user board ingestion and public curated feed ingestion.
 */
export async function processJobLink(
  rawUrl: string,
  source: 'telegram' | 'manual' | 'bookmarklet' | 'feed' | 'admin' = 'telegram',
  userId?: string,
  target: 'personal' | 'public' = 'personal',
  workspaceId?: string,
  submittedByName?: string
) {
  try {
    const url = rawUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.warn(`[Ingestion] Invalid URL skipped: ${url}`);
      return null;
    }

    console.log(`[Ingestion] Processing ${target} job link from ${source}: ${url}`);

    if (target === 'public') {
      const condition = workspaceId
        ? and(eq(publicJobs.workspaceId, workspaceId), eq(publicJobs.link, url))
        : and(isNull(publicJobs.workspaceId), eq(publicJobs.link, url));

      const existing = await db
        .select({ id: publicJobs.id })
        .from(publicJobs)
        .where(condition)
        .limit(1);

      if (existing.length > 0) {
        console.log(`[Ingestion] Duplicate scoped link skipped: ${url}`);
        return { duplicate: true, id: existing[0].id };
      }

      console.log(`[Ingestion] Scraping content for public job ${url}...`);
      const scraped = await scrapeJobPage(url);
      const extracted = await extractJobDetails(scraped.text, url, scraped.isFallback);

      const inserted = await db
        .insert(publicJobs)
        .values({
          company: extracted.company,
          role: extracted.role,
          link: url,
          location: extracted.location || 'N/A',
          exp: extracted.exp || 'N/A',
          source,
          postedBy: userId || null,
          workspaceId: workspaceId || null,
          submittedByName: submittedByName || null,
        })
        .returning();

      return { success: true, job: inserted[0] };
    }

    // Target: personal pipeline
    const existing = userId
      ? await db
          .select({ id: jobs.id })
          .from(jobs)
          .where(and(eq(jobs.link, url), eq(jobs.userId, userId)))
          .limit(1)
      : await db.select({ id: jobs.id }).from(jobs).where(eq(jobs.link, url)).limit(1);

    if (existing.length > 0) {
      console.log(`[Ingestion] Duplicate link already tracked by user. Skipping: ${url}`);
      return { duplicate: true, id: existing[0].id };
    }

    console.log(`[Ingestion] Scraping content for ${url}...`);
    const scraped = await scrapeJobPage(url);
    const extracted = await extractJobDetails(scraped.text, url, scraped.isFallback);

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
        userId: userId || null,
      })
      .returning();

    console.log(`[Ingestion] Successfully saved to personal board with ID: ${inserted[0]?.id}`);
    return { success: true, job: inserted[0] };
  } catch (error) {
    console.error(`[Ingestion Error for ${rawUrl}]:`, error);
    throw error;
  }
}
