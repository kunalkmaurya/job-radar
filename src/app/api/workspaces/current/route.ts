import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import {
  getOrCreateUserPod,
  getPodDetails,
  getTelegramConnectUrl,
  updatePodTelegramChatId,
  sendTelegramTestMessage,
  resolveTelegramChat,
  syncPodTelegramJobs,
} from '@/lib/workspace';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const pod = await getOrCreateUserPod(session.sub, session.name);
    if (!pod) {
      return NextResponse.json({ success: false, error: 'Pod unavailable' }, { status: 500 });
    }

    const details = await getPodDetails(pod.id);
    const origin =
      request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteUrl = `${origin}/join?code=${pod.inviteCode}`;
    const telegramConnectUrl = getTelegramConnectUrl(pod.inviteCode);

    return NextResponse.json({
      success: true,
      pod: {
        ...details,
        telegramChatId: pod.telegramChatId,
        inviteUrl,
        telegramConnectUrl,
        isTelegramConnected: Boolean(pod.telegramChatId),
      },
    });
  } catch (err) {
    console.error('[API /api/workspaces/current GET Error]:', err);
    return NextResponse.json({ success: false, error: 'Failed to load pod' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const pod = await getOrCreateUserPod(session.sub, session.name);
    if (!pod) {
      return NextResponse.json({ success: false, error: 'Pod unavailable' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const { telegramChatId } = body;

    let finalChatId: string | null = null;
    let chatTitle: string | undefined;

    if (telegramChatId && typeof telegramChatId === 'string' && telegramChatId.trim()) {
      const resolved = await resolveTelegramChat(telegramChatId);
      if (!resolved.success || !resolved.chatId) {
        return NextResponse.json(
          { success: false, error: resolved.error || 'Failed to verify Telegram chat' },
          { status: 400 }
        );
      }
      finalChatId = resolved.chatId;
      chatTitle = resolved.title;

      await sendTelegramTestMessage(
        finalChatId,
        `Job Radar: Connected to "${pod.name}"! Any job links sent in this chat will now sync to Explore Jobs.`
      );
    }

    const updated = await updatePodTelegramChatId(pod.id, finalChatId);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      telegramChatId: updated.telegramChatId,
      chatTitle,
      isTelegramConnected: Boolean(updated.telegramChatId),
    });
  } catch (err) {
    console.error('[API /api/workspaces/current PATCH Error]:', err);
    return NextResponse.json({ success: false, error: 'Failed to update pod' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.sub) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const pod = await getOrCreateUserPod(session.sub, session.name);
    if (!pod) {
      return NextResponse.json({ success: false, error: 'Pod unavailable' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    if (body.action === 'sync_jobs') {
      const syncResult = await syncPodTelegramJobs(pod.id);
      if (!syncResult.success) {
        return NextResponse.json({ success: false, error: syncResult.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Pod Telegram sync active. Total pod jobs: ${syncResult.totalPodJobs}`,
        data: syncResult,
      });
    }

    if (body.action === 'test_ping') {
      const chatId = body.telegramChatId || pod.telegramChatId;
      if (!chatId) {
        return NextResponse.json(
          { success: false, error: 'No Telegram Group Chat ID configured' },
          { status: 400 }
        );
      }

      const pingMsg = `Job Radar: Connection verified for "${pod.name}"! Any job links sent in this chat will now sync to your team's Explore Jobs feed.`;
      const result = await sendTelegramTestMessage(chatId, pingMsg);

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'Test message sent successfully' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[API /api/workspaces/current POST Error]:', err);
    return NextResponse.json({ success: false, error: 'Test ping failed' }, { status: 500 });
  }
}
