'use client';

import React from 'react';
import { MessageSquare, Send, Edit3 } from 'lucide-react';
import { PodData } from '../pod/PodInviteModal';

interface ProfilePodSyncSectionProps {
  pod: PodData | null;
  isEditingChatId: boolean;
  setIsEditingChatId: (v: boolean) => void;
  chatIdInput: string;
  setChatIdInput: (v: string) => void;
  handleSaveChatId: () => void;
  handleTestPing: () => void;
}

export function ProfilePodSyncSection({
  pod,
  isEditingChatId,
  setIsEditingChatId,
  chatIdInput,
  setChatIdInput,
  handleSaveChatId,
  handleTestPing,
}: ProfilePodSyncSectionProps) {
  return (
    <div className="p-3.5 border border-(--border-subtle) bg-(--bg-app)/60 rounded-md space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-(--text-primary)">Telegram Sync Status</span>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-xs border ${
            pod?.isTelegramConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          {pod?.isTelegramConnected ? 'Connected' : 'Not Connected'}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-(--text-muted)">
        <span>Chat ID: {pod?.telegramChatId || 'None'}</span>
        <div className="flex items-center gap-2">
          {pod?.isTelegramConnected && (
            <button
              onClick={handleTestPing}
              className="text-(--accent-blue-bright) hover:underline text-xs flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Test Ping</span>
            </button>
          )}
          <button
            onClick={() => setIsEditingChatId(!isEditingChatId)}
            className="text-(--text-secondary) hover:text-(--text-primary) text-xs flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditingChatId ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>
      </div>

      {isEditingChatId && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="-100... or @channelname"
              value={chatIdInput}
              onChange={(e) => setChatIdInput(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs bg-(--bg-surface) border border-(--border-subtle) text-(--text-primary) font-mono rounded-xs focus:outline-none focus:border-(--accent-primary)"
            />
            <button
              onClick={handleSaveChatId}
              className="px-2.5 py-1 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-semibold rounded-xs cursor-pointer"
            >
              Save
            </button>
          </div>
          <p className="text-[10px] text-(--text-muted)">
            Enter numeric ID (-100...) or public channel/group @username.
          </p>
        </div>
      )}
    </div>
  );
}
