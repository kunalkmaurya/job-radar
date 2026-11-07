import { db } from '@/db';
import { workspaces, workspaceMembers, users, publicJobs } from '@/db/schema';
import { eq, count, and, isNull } from 'drizzle-orm';
import crypto from 'crypto';

export function generateInviteCode(): string {
  return 'pod_' + crypto.randomBytes(4).toString('hex');
}

export function getTelegramConnectUrl(inviteCode: string): string {
  const botUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
    process.env.TELEGRAM_BOT_USERNAME ||
    'Jobradarkunalbot';
  return `https://t.me/${botUsername}?startgroup=${inviteCode}`;
}

export async function getOrCreateUserPod(userId: string, userName?: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const existingMembership = await db
    .select({
      workspaceId: workspaceMembers.workspaceId,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, userId))
    .limit(1);

  if (existingMembership.length > 0) {
    const ws = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, existingMembership[0].workspaceId))
      .limit(1);
    if (ws.length > 0) {
      return ws[0];
    }
  }

  const podName = `${userName || 'My'} Pod`;
  const inviteCode = generateInviteCode();

  const [newPod] = await db
    .insert(workspaces)
    .values({
      name: podName,
      ownerId: userId,
      inviteCode,
      memberLimit: 6,
    })
    .returning();

  if (newPod) {
    await db.insert(workspaceMembers).values({
      workspaceId: newPod.id,
      userId,
      role: 'owner',
    });
  }

  return newPod;
}

export async function getPodDetails(workspaceId: string) {
  if (!process.env.DATABASE_URL) return null;

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace) return null;

  const members = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: workspaceMembers.role,
      joinedAt: workspaceMembers.joinedAt,
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.id))
    .where(eq(workspaceMembers.workspaceId, workspaceId));

  return {
    ...workspace,
    members,
    memberCount: members.length,
    isFull: members.length >= workspace.memberLimit,
  };
}

export async function resolveTelegramChat(identifier: string): Promise<{
  success: boolean;
  chatId?: string;
  title?: string;
  type?: string;
  error?: string;
}> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { success: false, error: 'TELEGRAM_BOT_TOKEN is not configured.' };

  let cleaned = identifier
    .trim()
    .replace(/^https?:\/\/t\.me\//i, '')
    .replace(/^t\.me\//i, '');
  if (!cleaned.startsWith('-') && !cleaned.startsWith('@') && isNaN(Number(cleaned))) {
    cleaned = '@' + cleaned;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(cleaned)}`
    );
    const data = await res.json();
    if (!data.ok || !data.result) {
      return {
        success: false,
        error:
          data.description === 'Bad Request: chat not found'
            ? 'Chat not found. Make sure @Jobradarkunalbot is added as admin to your group or channel.'
            : data.description || 'Failed to locate Telegram chat',
      };
    }

    return {
      success: true,
      chatId: String(data.result.id),
      title: data.result.title || data.result.first_name,
      type: data.result.type,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error connecting to Telegram',
    };
  }
}

export async function updatePodTelegramChatId(workspaceId: string, telegramChatId: string | null) {
  if (!process.env.DATABASE_URL) return null;
  const [updated] = await db
    .update(workspaces)
    .set({ telegramChatId: telegramChatId ? telegramChatId.trim() : null, updatedAt: new Date() })
    .where(eq(workspaces.id, workspaceId))
    .returning();
  return updated;
}

export async function sendTelegramTestMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { success: false, error: 'TELEGRAM_BOT_TOKEN is not configured.' };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId.trim(), text }),
    });
    const data = await res.json();
    if (!data.ok) {
      return { success: false, error: data.description || 'Telegram API rejected message' };
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function joinPodWithCode(userId: string, inviteCode: string) {
  if (!process.env.DATABASE_URL) {
    return { success: false, error: 'Database unavailable' };
  }

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.inviteCode, inviteCode))
    .limit(1);

  if (!workspace) {
    return { success: false, error: 'Invalid invite code. Pod not found.' };
  }

  const [existing] = await db
    .select()
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, userId))
    .limit(1);

  if (existing?.workspaceId === workspace.id) {
    return { success: true, workspace, alreadyMember: true };
  }

  const [memberCountRes] = await db
    .select({ count: count() })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.workspaceId, workspace.id));

  if (memberCountRes && Number(memberCountRes.count) >= workspace.memberLimit) {
    return { success: false, error: 'This Job Pod is already full (limit 6 peers).' };
  }

  if (existing) {
    await db.delete(workspaceMembers).where(eq(workspaceMembers.userId, userId));
  }

  await db.insert(workspaceMembers).values({
    workspaceId: workspace.id,
    userId,
    role: 'member',
  });

  return { success: true, workspace, alreadyMember: false };
}

export async function syncPodTelegramJobs(workspaceId: string) {
  if (!process.env.DATABASE_URL) return { success: false, error: 'Database unavailable' };

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace || !workspace.telegramChatId) {
    return { success: false, error: 'No Telegram group connected yet' };
  }

  const updated = await db
    .update(publicJobs)
    .set({
      workspaceId: workspace.id,
      submittedByName: 'Telegram Member',
      updatedAt: new Date(),
    })
    .where(and(isNull(publicJobs.workspaceId), eq(publicJobs.source, 'telegram')))
    .returning();

  const [podCountRes] = await db
    .select({ count: count() })
    .from(publicJobs)
    .where(eq(publicJobs.workspaceId, workspace.id));

  return {
    success: true,
    reassignedCount: updated.length,
    totalPodJobs: Number(podCountRes?.count || 0),
  };
}
