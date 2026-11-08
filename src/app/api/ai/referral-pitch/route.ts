import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDefaultReferralTemplate, ReferralPitchParams } from '@/lib/linkedin';

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

  return {
    client: new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    }),
    model: 'deepseek-chat',
  };
}

export async function POST(request: Request) {
  try {
    const body: ReferralPitchParams = await request.json();
    const { company, role, recipientName, tone = 'peer', candidateName, skills } = body;

    if (!company || !role) {
      return NextResponse.json(
        { success: false, error: 'Company and Role are required.' },
        { status: 400 }
      );
    }

    const fallbackPitch = getDefaultReferralTemplate(body);

    const hasApiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    if (!hasApiKey) {
      return NextResponse.json({ success: true, pitch: fallbackPitch, source: 'template' });
    }

    try {
      const { client, model } = getLLMClient();
      const prompt = `
You are an expert career strategist. Write a concise, genuine, high-converting LinkedIn direct message requesting an employee referral.

Role: ${role}
Target Company: ${company}
Recipient Name: ${recipientName || 'Connection'}
Sender Name: ${candidateName || 'Candidate'}
Tone Style: ${tone} (peer = friendly & warm; alumni = shared background / alumni network; formal = polite & direct)
Key Skills to Highlight: ${skills || 'Relevant engineering background'}

Constraints:
- Length: Strictly 50 to 80 words.
- Tone: Natural, respectful, low friction (easy for them to say yes or forward).
- Zero emojis.
- Do not add subject lines or placeholder brackets in the output body.
- Return ONLY the final message text.
      `.trim();

      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      });

      const pitch = completion.choices[0]?.message?.content?.trim() || fallbackPitch;
      return NextResponse.json({ success: true, pitch, source: 'ai' });
    } catch (llmErr) {
      console.warn('AI referral pitch generation fallback to template:', llmErr);
      return NextResponse.json({ success: true, pitch: fallbackPitch, source: 'template' });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate referral pitch';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
