export interface PodMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export interface PodData {
  id: string;
  name: string;
  inviteCode: string;
  memberLimit: number;
  inviteUrl: string;
  telegramConnectUrl: string;
  telegramChatId?: string | null;
  isTelegramConnected: boolean;
  memberCount: number;
  members: PodMember[];
}
