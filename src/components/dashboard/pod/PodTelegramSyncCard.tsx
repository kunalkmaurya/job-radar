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
    <div className="p-4 border border-(--border-subtle) bg-(--bg-app)/60 rounded-md space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-(--accent-primary)" />
          <span className="text-xs font-semibold text-(--text-primary)">Telegram Group Sync</span>
        </div>
        <div className="flex items-center gap-1.5">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh sync status"
              className="h-6 w-6 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) rounded-sm text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border"
            style={{
              backgroundColor: isTelegramConnected
                ? 'var(--status-offer-bg, #DCFFF1)'
                : 'var(--status-saved-bg, #F1F2F4)',
              color: isTelegramConnected
                ? 'var(--status-offer-text, #216E4E)'
                : 'var(--status-saved-text, #44546F)',
              borderColor: isTelegramConnected
                ? 'var(--status-offer-border, #7EE2B8)'
                : 'var(--status-saved-border, #DCDFE4)',
            }}
          >
            {isTelegramConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <p className="text-xs text-(--text-secondary) leading-relaxed">
        Add our bot to your friends group. Any job link posted by any member will automatically
        appear in your shared Explore feed.
      </p>

      {statusMessage && (
        <div
          className={`p-2 rounded-sm text-xs flex items-center gap-1.5 border ${
            statusMessage.isError
              ? 'bg-red-500/10 text-red-500 border-red-500/20'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
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
          className="flex-1 h-8 px-4 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) font-semibold text-xs rounded-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Connect</span>
        </a>

        {isTelegramConnected && onSendTest && (
          <button
            onClick={handleTest}
            disabled={isBusy}
            className="h-8 px-3.5 bg-(--bg-surface) hover:bg-(--bg-surface-hover) border border-(--border-subtle) text-xs font-semibold text-(--text-primary) rounded-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
          >
            <span>Test</span>
          </button>
        )}
      </div>

      {onSaveChatId && (
        <PodChatIdEditor currentChatId={telegramChatId} onSave={handleSave} disabled={isBusy} />
      )}

      <div className="text-[11px] text-(--text-muted) flex items-center justify-center gap-1.5 pt-1">
        <span>Or in group:</span>
        <code className="px-1.5 py-0.5 rounded-sm bg-(--bg-surface) border border-(--border-subtle) font-mono text-[11px] text-(--text-primary) select-all">
          /connect {inviteCode}
        </code>
      </div>
    </div>
  );
}
