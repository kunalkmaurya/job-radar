'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Users } from 'lucide-react';
import { PodTelegramSyncCard } from './PodTelegramSyncCard';
import { PodDangerZone } from './PodDangerZone';
import { PodCreateJoinCard } from './PodCreateJoinCard';
import { PodMembersSection } from './PodMembersSection';
import { PodData, PodMember } from './types';
export type { PodData, PodMember };

interface PodInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  pod: PodData | null;
  onRefreshPod?: () => void;
  isRefreshing?: boolean;
  onSaveChatId?: (chatId: string) => Promise<boolean>;
  onSendTest?: () => Promise<boolean>;
  onLeavePod?: () => Promise<boolean>;
  onDeletePod?: () => Promise<boolean>;
  onClearJobs?: () => Promise<boolean>;
  onCreatePod?: () => Promise<boolean>;
  onJoinPod?: (code: string) => Promise<boolean>;
  isMutating?: boolean;
}

export function PodInviteModal({
  isOpen,
  onClose,
  pod,
  onRefreshPod,
  isRefreshing,
  onSaveChatId,
  onSendTest,
  onLeavePod,
  onDeletePod,
  onClearJobs,
  onCreatePod,
  onJoinPod,
  isMutating,
}: PodInviteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  if (!pod) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
        <PodCreateJoinCard
          onClose={onClose}
          onCreatePod={onCreatePod}
          onJoinPod={onJoinPod}
          isMutating={isMutating}
        />
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(pod.inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-(--bg-surface) border border-(--border-subtle) shadow-2xl p-5 sm:p-6 space-y-4 z-10 rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-(--border-subtle) pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-(--accent-primary)" />
              <h3 className="font-semibold text-sm text-(--text-primary)">{pod.name}</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider bg-(--accent-primary-bg) text-(--accent-blue-bright) border border-(--accent-border)">
                {pod.memberCount} / {pod.memberLimit} Peers
              </span>
            </div>
            <p className="text-xs text-(--text-muted)">
              Collaborate and pool job opportunities with friends
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 inline-flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-sm cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-(--text-secondary)">
            <span>Invite Link</span>
            <span className="text-(--text-muted) font-normal text-[11px]">
              Max {pod.memberLimit} members
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={pod.inviteUrl}
              className="flex-1 h-8 px-3 text-xs bg-(--bg-app) border border-(--border-subtle) text-(--text-primary) font-mono truncate rounded-sm select-all"
            />
            <button
              onClick={handleCopy}
              className="h-8 px-3.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) text-xs font-semibold rounded-sm flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-xs"
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

        <PodMembersSection members={pod.members} />

        <PodDangerZone
          onLeavePod={onLeavePod}
          onDeletePod={onDeletePod}
          onClearJobs={onClearJobs}
          isMutating={isMutating}
        />

        <div className="pt-3 border-t border-(--border-subtle) flex justify-end">
          <button
            onClick={onClose}
            className="h-8 px-5 text-xs font-semibold bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) rounded-sm cursor-pointer shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
