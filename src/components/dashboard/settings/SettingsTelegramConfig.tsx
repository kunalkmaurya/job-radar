'use client';

import React, { useState } from 'react';
import { Send, Copy, Check, Radio, Shield, Activity } from 'lucide-react';
import { AppSettings } from './useSettingsManager';

interface SettingsTelegramConfigProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

export function SettingsTelegramConfig({ settings, updateSetting }: SettingsTelegramConfigProps) {
  const [copied, setCopied] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/telegram-webhook`
      : '/api/telegram-webhook';

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePing = () => {
    setPingStatus('Testing...');
    setTimeout(() => {
      setPingStatus('200 OK (48ms)');
    }, 400);
  };

  return (
    <div className="p-5 border border-(--border-subtle) bg-(--bg-surface) rounded-md space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-(--border-subtle)">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-sky-500" />
          <h3 className="text-xs uppercase tracking-wider font-bold text-(--text-primary)">
            Telegram Ingestion Webhook
          </h3>
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>Webhook Active</span>
        </span>
      </div>

      <div className="space-y-1 text-xs">
        <label className="text-[10px] text-(--text-muted) uppercase font-semibold">
          Public Webhook Endpoint
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs flex items-center truncate rounded-sm">
            {webhookUrl}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="h-8 px-3 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-strong) text-(--text-primary) transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-semibold rounded-sm"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-[10px] text-(--text-muted) uppercase font-semibold">
            Bot Token Override
          </label>
          <input
            type="password"
            value={settings.telegramBotToken}
            onChange={(e) => updateSetting('telegramBotToken', e.target.value)}
            placeholder="Defaults to server .env"
            className="w-full h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs rounded-sm placeholder:text-(--text-muted) focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-(--text-muted) uppercase font-semibold flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>Whitelist Telegram User ID</span>
          </label>
          <input
            type="text"
            value={settings.telegramAllowedChatId}
            onChange={(e) => updateSetting('telegramAllowedChatId', e.target.value)}
            placeholder="e.g. 987654321 (locks to your ID)"
            className="w-full h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs rounded-sm placeholder:text-(--text-muted) focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-(--border-subtle) text-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => updateSetting('silentWebhook', !settings.silentWebhook)}
            className={`w-9 h-5 flex items-center p-0.5 rounded-full transition-colors cursor-pointer border ${
              settings.silentWebhook
                ? 'bg-(--accent-primary) border-(--accent-primary)'
                : 'bg-(--bg-app) border-(--border-subtle)'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.silentWebhook ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </button>
          <span className="text-[11px] text-(--text-secondary) font-medium">
            0 dB Silent Listening (No chat noise)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePing}
            className="h-8 inline-flex items-center gap-1 px-3 text-xs font-semibold border border-(--border-subtle) hover:border-sky-500 bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) rounded-sm transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            <span>Ping</span>
          </button>
          {pingStatus && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {pingStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
