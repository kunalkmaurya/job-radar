import { NextResponse } from 'next/server';
import { extractUrls, processJobLink } from '@/lib/ingestion';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    const chatId = String(message.chat?.id || '');
    let resolvedUserId: string | undefined;

    if (chatId) {
      try {
        const matched = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.telegramChatId, chatId))
          .limit(1);
        if (matched.length > 0) {
          resolvedUserId = matched[0].id;
        }
      } catch {
        // Continue with default routing if lookup fails
      }
    }

    // If chat belongs to a specific user, ingest to their personal board; otherwise ingest to public feed
    const target = resolvedUserId ? 'personal' : 'public';

    for (const url of urls) {
      try {
        await processJobLink(url, 'telegram', resolvedUserId, target);
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
