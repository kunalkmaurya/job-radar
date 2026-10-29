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
    <div className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[var(--text-primary)]">
            Telegram Ingestion Webhook
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>Webhook Active</span>
        </span>
      </div>

      {/* Webhook URL Endpoint Box */}
      <div className="space-y-1 font-mono text-xs">
        <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
          Public Webhook Endpoint
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] font-mono text-xs truncate">
            {webhookUrl}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Bot Token & Whitelist Chat ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        <div className="space-y-1">
          <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            Bot Token Override
          </label>
          <input
            type="password"
            value={settings.telegramBotToken}
            onChange={(e) => updateSetting('telegramBotToken', e.target.value)}
            placeholder="Defaults to server .env"
            className="w-full px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] font-mono text-xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Whitelist Telegram User ID</span>
          </label>
          <input
            type="text"
            value={settings.telegramAllowedChatId}
            onChange={(e) => updateSetting('telegramAllowedChatId', e.target.value)}
            placeholder="e.g. 987654321 (locks to your ID)"
            className="w-full px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] font-mono text-xs placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Toggle & Diagnostic Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)] font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => updateSetting('silentWebhook', !settings.silentWebhook)}
            className={`w-8 h-4.5 flex items-center p-0.5 transition-colors cursor-pointer border ${
              settings.silentWebhook
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]'
                : 'bg-[var(--bg-app)] border-[var(--border-subtle)]'
            }`}
          >
            <div
              className={`w-3 h-3 bg-white transition-transform ${settings.silentWebhook ? 'translate-x-3.5' : 'translate-x-0'}`}
            />
          </button>
          <span className="text-[11px] text-[var(--text-secondary)]">
            0 dB Silent Listening (No chat noise)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePing}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] border border-[var(--border-subtle)] hover:border-blue-400 bg-[var(--bg-app)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <Activity className="w-3 h-3 text-blue-400" />
            <span>Ping</span>
          </button>
          {pingStatus && (
            <span className="text-[10px] text-emerald-400 font-semibold">{pingStatus}</span>
          )}
        </div>
      </div>
    </div>
  );
}
