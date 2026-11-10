import OpenAI from 'openai';
import { ExtractedJob, ExtractedJobSchema } from '@/types';
import { extractCompanyFromUrl } from './scraper';

/**
 * Initializes the OpenAI-compatible client based on LLM_PROVIDER
 */
function getLLMClient() {
  const provider = (process.env.LLM_PROVIDER || 'deepseek').toLowerCase();

  if (provider === 'openai') {
    return {
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
        baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      }),
      model: 'gpt-4o-mini',
    };
  }

  // Default: DeepSeek
  return {
    client: new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    }),
    model: 'deepseek-chat',
  };
}

const SYSTEM_PROMPT = `
You are an expert ATS (Applicant Tracking System) job parser.
Analyze the provided job posting text and any [EXTRACTED PAGE HINTS] to extract:
1. Exact hiring company name
2. Concise role title
3. Primary location and work arrangement (e.g. "Pune, Maharashtra, India (Hybrid)", "Bengaluru, Mumbai", "San Francisco, CA", "Remote")
4. Experience level or required years (e.g. "Mid (3+ yrs)", "Senior (5+ yrs)", "Entry (0-2 yrs)", "Staff (8+ yrs)")

Output MUST be strictly valid JSON matching this structure:
{
  "company": "Company Name",
  "role": "Role Title",
  "location": "Location or Not Specified",
  "exp": "Experience Level or Not Specified"
}

Guidelines:
- If company name is not explicitly stated, infer it from headers, domain, or branding.
- Keep the role title clean and concise (exclude job requisition codes, IDs, or department numbers).
- For location: Thoroughly check [EXTRACTED PAGE HINTS], headers, sidebars, "Location(s):", "Locations:", "Primary Location:", "Remote status:", and "Job Type:".
  If a city/region AND a work arrangement (Remote/Hybrid) are both given, combine them (e.g. "Pune, Maharashtra, India (Hybrid)").
  If multiple locations are listed (e.g. "Bengaluru, Mumbai"), include them.
  If and ONLY if no location or work arrangement can be determined from the posting, return "Not Specified". Never guess or use "Remote / Flexible".
- For exp: Look for required years of experience or seniority level (e.g. "3+ yrs", "5+ years", "Senior", "Mid-Senior (3-8 yrs)"). If not stated, return "Not Specified".
- Respond ONLY with the JSON object. Do not wrap in markdown fences or add explanations.
`;

/**
 * Extracts company, role, location, and experience from scraped job text using the active LLM provider
 */
export async function extractJobDetails(
  scrapedText: string,
  sourceUrl: string,
  isFallback?: boolean
): Promise<ExtractedJob> {
  const fallbackCompany = extractCompanyFromUrl(sourceUrl);

  if (isFallback) {
    return {
      company: fallbackCompany,
      role: 'Review Role (Manual Check)',
      link: sourceUrl,
      location: 'Not Specified',
      exp: 'Not Specified',
    };
  }

  try {
    const { client, model } = getLLMClient();

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Job Link: ${sourceUrl}\n\nJob Posting Content:\n${scrapedText}`,
        },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from LLM');
    }

    const parsed = JSON.parse(content);
    const rawLoc = (parsed.location || '').trim();
    const isLocUnspecified =
      !rawLoc ||
      rawLoc === 'N/A' ||
      /^(not specified|unspecified|unknown|remote \/ flexible|n\/a)$/i.test(rawLoc);

    const rawExp = (parsed.exp || '').trim();
    const isExpUnspecified =
      !rawExp ||
      rawExp === 'N/A' ||
      /^(not specified|unspecified|unknown|all levels|n\/a)$/i.test(rawExp);

    return ExtractedJobSchema.parse({
      company: parsed.company || fallbackCompany,
      role: parsed.role || 'Software Engineer',
      link: sourceUrl,
      location: isLocUnspecified ? 'Not Specified' : rawLoc,
      exp: isExpUnspecified ? 'Not Specified' : rawExp,
    });
  } catch (err) {
    console.error(`[AI Extraction Failed for ${sourceUrl}]:`, err);
    return {
      company: fallbackCompany,
      role: 'Review Role (Manual Check)',
      link: sourceUrl,
      location: 'Not Specified',
      exp: 'Not Specified',
    };
  }
}
