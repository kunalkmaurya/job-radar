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
        // Fallback to owner below
      }
    }

    // Fallback: If chat is not mapped to a specific user, default to the workspace owner/admin
    if (!resolvedUserId) {
      try {
        const adminEmail = (
          process.env.ADMIN_EMAIL ||
          process.env.ADMIN_EMAILS ||
          'kunalkrraj@gmail.com'
        )
          .split(',')[0]
          .trim()
          .toLowerCase();

        const adminUser = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, adminEmail))
          .limit(1);

        if (adminUser.length > 0) {
          resolvedUserId = adminUser[0].id;
          if (chatId) {
            await db
              .update(users)
              .set({ telegramChatId: chatId })
              .where(eq(users.id, adminUser[0].id));
          }
        } else {
          const fallbackAdmin = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.role, 'admin'))
            .limit(1);
          if (fallbackAdmin.length > 0) {
            resolvedUserId = fallbackAdmin[0].id;
          }
        }
      } catch (err) {
        console.warn('[Telegram Webhook] Admin fallback lookup failed:', err);
      }
    }

    for (const url of urls) {
      try {
        // Ingest into personal dashboard
        await processJobLink(url, 'telegram', resolvedUserId, 'personal');
        // Also ensure public feed has it
        await processJobLink(url, 'telegram', resolvedUserId, 'public');
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
