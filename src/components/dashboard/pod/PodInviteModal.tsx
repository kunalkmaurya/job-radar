'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Users } from 'lucide-react';
import { PodTelegramSyncCard } from './PodTelegramSyncCard';

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

interface PodInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  pod: PodData | null;
  onRefreshPod?: () => void;
  isRefreshing?: boolean;
  onSaveChatId?: (chatId: string) => Promise<boolean>;
  onSendTest?: () => Promise<boolean>;
}

export function PodInviteModal({
  isOpen,
  onClose,
  pod,
  onRefreshPod,
  isRefreshing,
  onSaveChatId,
  onSendTest,
}: PodInviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pod) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(pod.inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-(--bg-surface) border border-(--border-subtle) shadow-2xl p-5 sm:p-6 space-y-4 z-10 rounded-lg">
        <div className="flex items-start justify-between border-b border-(--border-subtle) pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-(--accent-primary)" />
              <h3 className="font-bold text-sm text-(--text-primary)">{pod.name}</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-(--accent-primary-bg) text-(--accent-blue-bright) border border-(--accent-primary)/30">
                {pod.memberCount} / {pod.memberLimit} Peers
              </span>
            </div>
            <p className="text-xs text-(--text-muted) mt-0.5">
              Collaborate and pool job opportunities with friends
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-(--text-muted) hover:text-(--text-primary)">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-(--text-secondary) block">
            Invite Link (Max {pod.memberLimit} members)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={pod.inviteUrl}
              className="flex-1 px-3 py-1.5 text-xs bg-(--bg-app) border border-(--border-subtle) text-(--text-primary) font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <PodTelegramSyncCard
          isTelegramConnected={pod.isTelegramConnected}
          telegramChatId={pod.telegramChatId}
          telegramConnectUrl={pod.telegramConnectUrl}
          inviteCode={pod.inviteCode}
          onRefresh={onRefreshPod}
          isRefreshing={isRefreshing}
          onSaveChatId={onSaveChatId}
          onSendTest={onSendTest}
        />

        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-semibold text-(--text-secondary)">Members</div>
          <div className="flex flex-wrap gap-1.5">
            {pod.members.map((m) => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) rounded-xs"
              >
                <span className="w-4 h-4 rounded-full bg-(--accent-primary-bg) text-(--accent-primary) font-bold text-[9px] flex items-center justify-center">
                  {(m.name || m.email)[0].toUpperCase()}
                </span>
                <span>{m.name || m.email.split('@')[0]}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-(--border-subtle) flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium border border-(--border-subtle) bg-(--bg-app) hover:bg-(--bg-surface-hover) rounded-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
