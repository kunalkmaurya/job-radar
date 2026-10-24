import { NextResponse } from 'next/server';
import { extractUrls, processJobLink } from '@/lib/ingestion';

export async function POST(request: Request) {
  try {
    // 1. Verify Secret Token (if configured)
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret) {
      const incomingSecret = request.headers.get('x-telegram-bot-api-secret-token');
      if (incomingSecret !== secret) {
        console.warn('[Telegram Webhook] Unauthorized request rejected (invalid secret token)');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const update = await request.json();
    console.log('[Telegram Webhook] Received update:', JSON.stringify(update));

    // 2. Extract message text from channel_post or direct message
    const message = update.channel_post || update.message || update.edited_channel_post;
    if (!message || !message.text) {
      // Ignore non-text updates (e.g. photos without caption, join events)
      return NextResponse.json({ ok: true });
    }

    // 3. Extract all URLs from message text
    const urls = extractUrls(message.text);
    if (urls.length === 0) {
      console.log('[Telegram Webhook] No URLs found in message text');
      return NextResponse.json({ ok: true });
    }

    // 4. Process each link through scraping & AI pipeline
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
    // Always return 200 so Telegram does not aggressively retry on internal errors
    return NextResponse.json({ ok: true, error: 'Internal processing error' });
  }
}
