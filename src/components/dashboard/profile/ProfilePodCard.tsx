'use client';

import React from 'react';
import { Users, RefreshCw, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { useProfilePod } from './useProfilePod';
import { ProfilePodSyncSection } from './ProfilePodSyncSection';

interface ProfilePodCardProps {
  onOpenInviteModal?: () => void;
}

export function ProfilePodCard({ onOpenInviteModal }: ProfilePodCardProps) {
  const {
    pod,
    loading,
    refreshing,
    isEditingChatId,
    setIsEditingChatId,
    chatIdInput,
    setChatIdInput,
    statusMsg,
    copied,
    handleRefresh,
    handleSaveChatId,
    handleTestPing,
    handleCopyInvite,
  } = useProfilePod();

  if (loading) {
    return (
      <div className="p-5 border border-(--border-subtle) bg-(--bg-surface) rounded-lg flex items-center justify-center text-xs text-(--text-muted)">
        Loading pod information...
      </div>
    );
  }

  return (
    <div className="p-5 border border-(--border-subtle) bg-(--bg-surface) rounded-lg space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-(--accent-primary)" />
          <h3 className="font-bold text-sm text-(--text-primary)">{pod?.name || 'Job Pod'}</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-(--accent-primary-bg) text-(--accent-blue-bright) border border-(--accent-primary)/30">
            {pod?.memberCount || 1} / {pod?.memberLimit || 6} Peers
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh status"
            className="p-1.5 border border-(--border-subtle) bg-(--bg-app) hover:bg-(--bg-surface-hover) rounded-xs text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-(--accent-primary)' : ''}`}
            />
          </button>
          {onOpenInviteModal && (
            <button
              onClick={onOpenInviteModal}
              className="px-2.5 py-1 text-xs font-semibold bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white rounded-xs cursor-pointer"
            >
              Manage Pod
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-2 rounded-xs text-xs flex items-center gap-2 border ${
            statusMsg.isError
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {statusMsg.isError ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <ProfilePodSyncSection
        pod={pod}
        isEditingChatId={isEditingChatId}
        setIsEditingChatId={setIsEditingChatId}
        chatIdInput={chatIdInput}
        setChatIdInput={setChatIdInput}
        handleSaveChatId={handleSaveChatId}
        handleTestPing={handleTestPing}
      />

      <div className="flex items-center justify-between text-xs text-(--text-muted) pt-1">
        <span>
          Invite Code: <code className="font-mono text-(--text-primary)">{pod?.inviteCode}</code>
        </span>
        <button
          onClick={handleCopyInvite}
          className="flex items-center gap-1 text-(--accent-blue-bright) hover:underline cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Link' : 'Copy Invite Link'}</span>
        </button>
      </div>
    </div>
  );
}
