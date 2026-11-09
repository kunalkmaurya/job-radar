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
    const message = update.channel_post || update.message || update.edited_channel_post;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat?.id || '');

    // 0. Handle bot added to group greeting
    if (message.new_chat_members && Array.isArray(message.new_chat_members)) {
      const botUser = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'Jobradarkunalbot';
      const isSelfAdded = message.new_chat_members.some(
        (m: { username?: string; is_bot?: boolean }) =>
          m.username?.toLowerCase() === botUser.toLowerCase() || m.is_bot
      );
      if (isSelfAdded && chatId) {
        await sendTelegramMessage(
          chatId,
          'Job Radar bot added! To link this group to your pod, type: /connect <INVITE_CODE> (or set Chat ID in your Profile).'
        );
        return NextResponse.json({ ok: true });
      }
    }

    if (!message.text) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();

    // 1. Handshake: /start pod_xxx or /connect pod_xxx
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
            `Connected to "${ws.name}"! Any job links dropped here will automatically sync to your group Explore feed.`
          );
          return NextResponse.json({ ok: true });
        } else {
          await sendTelegramMessage(
            chatId,
            `Invalid pod invite code: "${code}". Please check your dashboard.`
          );
          return NextResponse.json({ ok: true });
        }
      } else {
        await sendTelegramMessage(
          chatId,
          `To pair this chat, type /connect <INVITE_CODE> (e.g. /connect pod_xxxx) or copy your Chat ID (${chatId}) into Job Radar Profile.`
        );
        return NextResponse.json({ ok: true });
      }
    }

    const urls = extractUrls(message.text);
    if (urls.length === 0) {
      return NextResponse.json({ ok: true });
    }

    // 2. Check if chat belongs to a collaborative pod
    let podWorkspaceId: string | undefined;
    let podName: string | undefined;

    if (chatId) {
      const [matchedPod] = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.telegramChatId, chatId))
        .limit(1);

      if (matchedPod) {
        podWorkspaceId = matchedPod.id;
        podName = matchedPod.name;
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
        podName = matchedByHandle.name;
        if (chatId) {
          await db
            .update(workspaces)
            .set({ telegramChatId: chatId, updatedAt: new Date() })
            .where(eq(workspaces.id, matchedByHandle.id));
        }
      }
    }

    const senderName = message.from?.first_name || message.chat?.title || 'Pod Peer';

    // 3. Fallback to user if not a pod
    let resolvedUser: { id: string; role: string } | undefined;
    if (!podWorkspaceId && chatId) {
      const [matched] = await db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.telegramChatId, chatId))
        .limit(1);
      if (matched) resolvedUser = matched;
    }

    if (!podWorkspaceId && !resolvedUser && update.channel_post) {
      const adminEmail = (
        process.env.ADMIN_EMAIL ||
        process.env.ADMIN_EMAILS ||
        'kunalkrraj@gmail.com'
      )
        .split(',')[0]
        .trim()
        .toLowerCase();

      const [adminUser] = await db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.email, adminEmail))
        .limit(1);
      if (adminUser) resolvedUser = adminUser;
    }

    for (const url of urls) {
      try {
        if (podWorkspaceId) {
          const result = await processJobLink(
            url,
            'telegram',
            undefined,
            'public',
            podWorkspaceId,
            senderName
          );
          if (result && 'job' in result && result.job) {
            await sendTelegramMessage(
              chatId,
              `Saved "${result.job.role} at ${result.job.company}" to ${podName}! Your peers can now track it.`
            );
          } else if (result && 'duplicate' in result) {
            await sendTelegramMessage(chatId, `This job link is already saved in ${podName}!`);
          }
        } else if (resolvedUser?.role === 'admin' || update.channel_post) {
          const result = await processJobLink(url, 'admin', resolvedUser?.id, 'public');
          if (result && 'job' in result && result.job) {
            await sendTelegramMessage(
              chatId,
              `Published "${result.job.role} at ${result.job.company}" to Public Feed!`
            );
          }
        } else if (resolvedUser) {
          await processJobLink(url, 'telegram', resolvedUser.id, 'personal');
          await sendTelegramMessage(chatId, 'Saved job link to your personal dashboard!');
        } else {
          await sendTelegramMessage(
            chatId,
            'To connect this group to your Job Radar Pod, please send /connect <INVITE_CODE>.'
          );
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
