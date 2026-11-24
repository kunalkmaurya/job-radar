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
 * Extracts structured metadata hints (location, workplace type) from raw text or markdown
 */
export function extractMetadataHints(rawText: string): string[] {
  const hints: string[] = [];

  const locMatch = rawText.match(
    /(?:Locations?\(s\)?|Primary Location|Job Location|Work Location)\s*[:\-]\s*([^\n\r|]{2,100})/i
  );
  if (locMatch && locMatch[1]) {
    const loc = locMatch[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
    if (loc.length > 1 && !/^(req|job|id|apply|save|cookie|share|overview)/i.test(loc)) {
      hints.push(`Location Hint: ${loc}`);
    }
  }

  const workTypeMatch = rawText.match(
    /(?:Remote status|Workplace Type|Job Type|Work Arrangement)\s*[:\-]\s*([^\n\r|]{2,50})/i
  );
  if (workTypeMatch && workTypeMatch[1]) {
    const wt = workTypeMatch[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
    if (wt.length > 1 && !/^(full-time|part-time|contract|permanent)/i.test(wt)) {
      hints.push(`Workplace Type Hint: ${wt}`);
    }
  }

  return hints;
}

/**
 * Extracts schema.org/JobPosting JSON-LD from HTML
 */
function extractJsonLdHints(html: string): string[] {
  const hints: string[] = [];
  try {
    const scriptRegex =
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
      const content = match[1].trim();
      if (content.includes('JobPosting')) {
        const json = JSON.parse(content);
        const data = Array.isArray(json)
          ? json.find((item) => item['@type'] === 'JobPosting')
          : json;
        if (data) {
          if (data.title) hints.push(`Job Title Hint: ${data.title}`);
          if (data.hiringOrganization?.name)
            hints.push(`Company Hint: ${data.hiringOrganization.name}`);
          if (data.jobLocation) {
            const loc = Array.isArray(data.jobLocation) ? data.jobLocation[0] : data.jobLocation;
            if (loc?.address) {
              const addr = loc.address;
              const formatted = [addr.addressLocality, addr.addressRegion, addr.addressCountry]
                .filter(Boolean)
                .join(', ');
              if (formatted) hints.push(`Location Hint: ${formatted}`);
            }
          }
          if (data.jobLocationType === 'TELECOMMUTE') hints.push('Workplace Type Hint: Remote');
        }
      }
    }
  } catch {
    // Non-fatal JSON-LD parsing failure
  }
  return hints;
}

/**
 * Scrapes job posting content using Tier 1 (Jina Reader) with Tier 2 (Direct fetch) fallback
 */
export async function scrapeJobPage(url: string): Promise<ScrapedContent> {
  // Tier 1: Jina Reader Proxy (Handles Workday, JS rendering, bot walls)
  try {
    const jinaUrl = `https://r.jina.ai/${encodeURI(url)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(jinaUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'text/plain, text/markdown',
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 100) {
        const hints = extractMetadataHints(text);
        const preamble = hints.length > 0 ? `[EXTRACTED PAGE HINTS]:\n${hints.join('\n')}\n\n` : '';
        return {
          text: (preamble + text).slice(0, 20000),
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
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const html = await res.text();
      const jsonLdHints = extractJsonLdHints(html);
      const textHints = extractMetadataHints(html);
      const combinedHints = Array.from(new Set([...jsonLdHints, ...textHints]));

      const cleanText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanText.length > 100) {
        const preamble =
          combinedHints.length > 0
            ? `[EXTRACTED PAGE HINTS]:\n${combinedHints.join('\n')}\n\n`
            : '';
        return {
          text: (preamble + cleanText).slice(0, 20000),
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
