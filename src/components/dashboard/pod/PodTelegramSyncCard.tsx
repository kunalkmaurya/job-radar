'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { PodChatIdEditor } from './PodChatIdEditor';

interface PodTelegramSyncCardProps {
  isTelegramConnected: boolean;
  telegramChatId?: string | null;
  telegramConnectUrl: string;
  inviteCode: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onSaveChatId?: (chatId: string) => Promise<boolean>;
  onSendTest?: () => Promise<boolean>;
}

export function PodTelegramSyncCard({
  isTelegramConnected,
  telegramChatId,
  telegramConnectUrl,
  inviteCode,
  onRefresh,
  isRefreshing,
  onSaveChatId,
  onSendTest,
}: PodTelegramSyncCardProps) {
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(
    null
  );
  const [isBusy, setIsBusy] = useState(false);

  const handleTest = async () => {
    if (!onSendTest) return;
    setIsBusy(true);
    setStatusMessage(null);
    const ok = await onSendTest();
    setIsBusy(false);
    setStatusMessage(
      ok
        ? { text: 'Test message sent to group!' }
        : { text: 'Test failed. Ensure bot is in group.', isError: true }
    );
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSave = async (chatId: string) => {
    if (!onSaveChatId) return false;
    const ok = await onSaveChatId(chatId);
    setStatusMessage(
      ok ? { text: 'Chat ID saved' } : { text: 'Failed to save chat ID', isError: true }
    );
    setTimeout(() => setStatusMessage(null), 3000);
    return ok;
  };

  return (
    <div className="p-3.5 border border-(--border-subtle) bg-(--bg-app)/50 rounded-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-(--text-primary)">Telegram Group Sync</span>
        </div>
        <div className="flex items-center gap-1.5">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh sync status"
              className="p-1 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) rounded-xs text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-xs border ${
              isTelegramConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {isTelegramConnected ? 'Group Connected' : 'Not Connected'}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-(--text-muted) leading-relaxed">
        Add our bot to your friends group. Any job link posted by any member will automatically
        appear in your shared Explore Jobs feed.
      </p>

      {statusMessage && (
        <div
          className={`p-2 rounded-xs text-[11px] flex items-center gap-1.5 border ${
            statusMessage.isError
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {statusMessage.isError ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <a
          href={telegramConnectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Add Bot to Group</span>
        </a>

        {isTelegramConnected && onSendTest && (
          <button
            onClick={handleTest}
            disabled={isBusy}
            className="py-1.5 px-3 bg-(--bg-surface) hover:bg-(--bg-surface-hover) border border-(--border-subtle) text-xs font-semibold text-(--text-primary) rounded-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>Test Ping</span>
          </button>
        )}
      </div>

      {onSaveChatId && (
        <PodChatIdEditor currentChatId={telegramChatId} onSave={handleSave} disabled={isBusy} />
      )}

      <p className="text-[10px] text-(--text-muted) font-mono text-center pt-1">
        Or in your group, type: /connect {inviteCode}
      </p>
    </div>
  );
}
