import { NextResponse } from 'next/server';
import { extractUrls, processJobLink } from '@/lib/ingestion';

export async function POST(request: Request) {
  try {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret) {
      const incomingSecret = request.headers.get('x-telegram-bot-api-secret-token');
      if (incomingSecret !== secret) {
        console.warn('[Telegram Webhook] Unauthorized request rejected');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const update = await request.json();
    const message = update.channel_post || update.message || update.edited_channel_post;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const urls = extractUrls(message.text);
    if (urls.length === 0) {
      return NextResponse.json({ ok: true });
    }

    for (const url of urls) {
      try {
        await processJobLink(url, 'telegram');
      } catch (err) {
        console.error(`[Telegram Webhook] Failed to process ${url}:`, err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Telegram Webhook Error]:', err);
    return NextResponse.json({ ok: true, error: 'Internal processing error' });
  }
}
