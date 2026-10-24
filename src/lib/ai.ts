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
Analyze the provided job posting text and extract the exact hiring company name and the job/role title.

Output MUST be strictly valid JSON matching this structure:
{
  "company": "Company Name",
  "role": "Role Title"
}

Guidelines:
- If the company name is not explicitly mentioned, infer it from headers or URL context.
- Keep the role title concise (e.g. "Senior Backend Engineer" rather than including job IDs).
- Respond ONLY with the JSON object. Do not wrap in markdown fences or add explanations.
`;

/**
 * Extracts company and role from scraped job text using the active LLM provider
 */
export async function extractJobDetails(
  scrapedText: string,
  sourceUrl: string,
  isFallback?: boolean
): Promise<ExtractedJob> {
  const fallbackCompany = extractCompanyFromUrl(sourceUrl);

  // If the scraper already had to use the fallback, don't waste tokens
  if (isFallback) {
    return {
      company: fallbackCompany,
      role: 'Review Role (Manual Check)',
      link: sourceUrl,
      location: 'N/A',
      exp: 'N/A',
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
    return ExtractedJobSchema.parse({
      company: parsed.company || fallbackCompany,
      role: parsed.role || 'Software Engineer',
      link: sourceUrl,
      location: 'N/A',
      exp: 'N/A',
    });
  } catch (err) {
    console.error(`[AI Extraction Failed for ${sourceUrl}]:`, err);
    // Graceful fallback to guarantee zero crash
    return {
      company: fallbackCompany,
      role: 'Review Role (Manual Check)',
      link: sourceUrl,
      location: 'N/A',
      exp: 'N/A',
    };
  }
}
