/**
 * Universal Scraper Engine
 * Handles static ATS (Lever, Greenhouse) and dynamic SPAs (Workday, LinkedIn)
 */

export interface ScrapedContent {
  text: string;
  sourceUrl: string;
  isFallback?: boolean;
}

/**
 * Extracts root company name from domain if scraping fails
 * e.g., "nvidia.wd5.myworkdayjobs.com" -> "Nvidia"
 */
export function extractCompanyFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    
    // Workday subdomain matching (e.g. nvidia.wd5.myworkdayjobs.com)
    if (host.includes('.myworkdayjobs.com')) {
      const parts = host.split('.');
      if (parts.length > 0 && parts[0] !== 'www') {
        const name = parts[0].replace(/[-_]/g, ' ');
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }

    // Greenhouse (boards.greenhouse.io/stripe/jobs)
    if (host.includes('greenhouse.io')) {
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const name = segments[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }

    // Lever (jobs.lever.co/linear/...)
    if (host.includes('lever.co')) {
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const name = segments[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }

    // General domain fallback
    const domainParts = host.replace(/^www\./, '').split('.');
    if (domainParts.length > 1) {
      const name = domainParts[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return 'Unknown Company';
  } catch {
    return 'Unknown Company';
  }
}

/**
 * Scrapes job posting content using Tier 1 (Jina Reader) with Tier 2 (Direct fetch) fallback
 */
export async function scrapeJobPage(url: string): Promise<ScrapedContent> {
  // Tier 1: Jina Reader Proxy (Handles Workday, JS rendering, bot walls)
  try {
    const jinaUrl = `https://r.jina.ai/${encodeURI(url)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(jinaUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/plain, text/markdown',
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const text = await res.text();
      // Ensure we actually got meaningful job content
      if (text && text.trim().length > 100) {
        return {
          text: text.slice(0, 15000), // Cap tokens for the LLM
          sourceUrl: url,
        };
      }
    }
  } catch (err) {
    console.warn(`[Scraper Tier 1 Failed for ${url}]:`, err);
  }

  // Tier 2: Direct HTTP Fetch with Desktop User-Agent
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const html = await res.text();
      // Clean HTML tags into plain text
      const cleanText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanText.length > 100) {
        return {
          text: cleanText.slice(0, 15000),
          sourceUrl: url,
        };
      }
    }
  } catch (err) {
    console.warn(`[Scraper Tier 2 Failed for ${url}]:`, err);
  }

  // Fail-Safe Fallback
  const fallbackCompany = extractCompanyFromUrl(url);
  return {
    text: `Job posting URL: ${url}. Hiring Company: ${fallbackCompany}. Details could not be fetched due to client authentication or strict protection.`,
    sourceUrl: url,
    isFallback: true,
  };
}
