import { NextResponse } from 'next/server';
import { extractUrls, processJobLink } from '@/lib/ingestion';
import { db } from '@/db';
import { users, workspaces } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    console.warn('[Telegram Webhook] Failed to send reply:', err);
  }
}

export async function POST(request: Request) {
  try {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret) {
      const incomingSecret = request.headers.get('x-telegram-bot-api-secret-token');
      if (incomingSecret !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const update = await request.json();
    const message =
      update.channel_post || update.message || update.edited_channel_post || update.edited_message;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat?.id || '');

    if (message.new_chat_members && Array.isArray(message.new_chat_members)) {
      return NextResponse.json({ ok: true });
    }

    const rawText = message.text || message.caption || '';
    if (!rawText) {
      return NextResponse.json({ ok: true });
    }

    const text = rawText.trim();

    if (text.startsWith('/start') || text.startsWith('/connect')) {
      const parts = text.split(/\s+/);
      const code = parts[1]?.trim();
      if (code && chatId) {
        const [ws] = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.inviteCode, code))
          .limit(1);

        if (ws) {
          await db
            .update(workspaces)
            .set({ telegramChatId: chatId, updatedAt: new Date() })
            .where(eq(workspaces.id, ws.id));

          await sendTelegramMessage(
            chatId,
            `Connected to "${ws.name}". Any job links dropped here will sync to your group Explore feed.`
          );
          return NextResponse.json({ ok: true });
        } else {
          await sendTelegramMessage(
            chatId,
            `Invalid pod invite code: "${code}". Please check your dashboard.`
          );
          return NextResponse.json({ ok: true });
        }
      } else if (text.startsWith('/connect')) {
        await sendTelegramMessage(
          chatId,
          'To pair this chat to a pod, type /connect <INVITE_CODE> (e.g. /connect pod_xxxx).'
        );
        return NextResponse.json({ ok: true });
      }
    }

    const urls = extractUrls(text);
    if (urls.length === 0) {
      return NextResponse.json({ ok: true });
    }

    let podWorkspaceId: string | undefined;

    if (chatId) {
      const [matchedPod] = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.telegramChatId, chatId))
        .limit(1);

      if (matchedPod) {
        podWorkspaceId = matchedPod.id;
      }
    }

    if (!podWorkspaceId && message.chat?.username) {
      const cleanUsername = message.chat.username.replace(/^@/, '');
      const [matchedByHandle] = await db
        .select()
        .from(workspaces)
        .where(
          or(
            eq(workspaces.telegramChatId, `@${cleanUsername}`),
            eq(workspaces.telegramChatId, cleanUsername)
          )
        )
        .limit(1);

      if (matchedByHandle) {
        podWorkspaceId = matchedByHandle.id;
        if (chatId) {
          await db
            .update(workspaces)
            .set({ telegramChatId: chatId, updatedAt: new Date() })
            .where(eq(workspaces.id, matchedByHandle.id));
        }
      }
    }

    const senderName = message.from?.first_name || message.chat?.title || 'Pod Peer';

    const adminEmail = (
      process.env.ADMIN_EMAIL ||
      process.env.ADMIN_EMAILS ||
      'kunalkrraj@gmail.com'
    )
      .split(',')[0]
      .trim()
      .toLowerCase();

    let [adminUser] = await db
      .select({ id: users.id, role: users.role, email: users.email })
      .from(users)
      .where(
        or(
          eq(users.email, adminEmail),
          eq(users.email, 'kunalkrraj220@gmail.com'),
          eq(users.role, 'admin')
        )
      )
      .limit(1);

    if (!adminUser) {
      const [firstUser] = await db
        .select({ id: users.id, role: users.role, email: users.email })
        .from(users)
        .limit(1);
      adminUser = firstUser;
    }

    let resolvedUser: { id: string; role: string; email: string } | undefined;
    if (chatId) {
      const [matched] = await db
        .select({ id: users.id, role: users.role, email: users.email })
        .from(users)
        .where(eq(users.telegramChatId, chatId))
        .limit(1);
      if (matched) resolvedUser = matched;
    }

    const isDirectPrivateUser =
      resolvedUser && resolvedUser.role !== 'admin' && message.chat?.type === 'private';

    for (const url of urls) {
      try {
        if (podWorkspaceId) {
          await processJobLink(url, 'telegram', undefined, 'public', podWorkspaceId, senderName);
        } else if (isDirectPrivateUser && resolvedUser) {
          await processJobLink(url, 'telegram', resolvedUser.id, 'personal');
        } else {
          const targetAdminId = resolvedUser?.role === 'admin' ? resolvedUser.id : adminUser?.id;
          await processJobLink(url, 'admin', targetAdminId, 'public');
          if (targetAdminId) {
            try {
              await processJobLink(url, 'admin', targetAdminId, 'personal');
            } catch {
              // Duplicate on personal board
            }
          }
        }
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
