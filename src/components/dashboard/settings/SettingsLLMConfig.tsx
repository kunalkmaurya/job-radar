'use client';

import React, { useState } from 'react';
import { Cpu, Eye, EyeOff, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { AppSettings } from './useSettingsManager';
import { SettingsProviderCards, MODELS } from './SettingsProviderCards';

interface SettingsLLMConfigProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  isTesting: boolean;
  testResult: string | null;
  onTestConnection: (provider: string) => void;
}

export function SettingsLLMConfig({
  settings,
  updateSetting,
  isTesting,
  testResult,
  onTestConnection,
}: SettingsLLMConfigProps) {
  const [showKey, setShowKey] = useState(false);

  const selectProvider = (provider: AppSettings['llmProvider']) => {
    updateSetting('llmProvider', provider);
    const available = MODELS[provider];
    if (available && available.length > 0) {
      updateSetting('llmModel', available[0]);
    }
  };

  return (
    <div className="p-5 border border-(--border-subtle) bg-(--bg-surface) space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-(--border-subtle)">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-(--accent-primary)" />
          <h3 className="text-xs uppercase tracking-wider font-semibold text-(--text-primary)">
            AI Extraction Engine
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-(--bg-app) border border-(--border-subtle) text-(--accent-primary) font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{settings.llmModel}</span>
        </span>
      </div>

      {/* Visual Provider Cards */}
      <SettingsProviderCards
        currentProvider={settings.llmProvider}
        onSelectProvider={selectProvider}
      />

      {/* Model Chips */}
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <span className="text-[10px] uppercase tracking-wider text-(--text-muted)">Model:</span>
        {(MODELS[settings.llmProvider] || [settings.llmModel]).map((m) => {
          const isSelected = settings.llmModel === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => updateSetting('llmModel', m)}
              className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                isSelected
                  ? 'border-(--accent-primary) bg-(--bg-app) text-(--accent-primary) font-semibold'
                  : 'border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* API Key Row */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-(--text-muted) uppercase tracking-wider">API Key</span>
          <span className="text-[10px] text-(--text-muted)">Defaults to server .env if empty</span>
        </div>
        <div className="relative flex items-center">
          <input
            type={showKey ? 'text' : 'password'}
            value={settings.apiKey}
            onChange={(e) => updateSetting('apiKey', e.target.value)}
            placeholder="sk-••••••••••••••••••••••••••••••••"
            className="w-full px-3 py-2 pr-9 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2.5 p-1 text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer"
          >
            {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Toggle & Test Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-(--border-subtle) text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onTestConnection(settings.llmProvider)}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-(--border-subtle) hover:border-(--accent-primary) bg-(--bg-app) text-(--text-primary) transition-colors cursor-pointer disabled:opacity-50"
          >
            {isTesting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-(--accent-primary)" />
            )}
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>
          {testResult && (
            <span className="text-[11px] text-emerald-400 font-semibold">{testResult}</span>
          )}
        </div>

        {/* Industrial Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => updateSetting('useJinaFallback', !settings.useJinaFallback)}
            className={`w-8 h-4.5 flex items-center p-0.5 transition-colors cursor-pointer border ${
              settings.useJinaFallback
                ? 'bg-(--accent-primary) border-(--accent-primary)'
                : 'bg-(--bg-app) border-(--border-subtle)'
            }`}
          >
            <div
              className={`w-3 h-3 bg-white transition-transform ${settings.useJinaFallback ? 'translate-x-3.5' : 'translate-x-0'}`}
            />
          </button>
          <span className="text-[11px] text-(--text-secondary)">Jina Reader Fallback</span>
        </div>
      </div>
    </div>
  );
}
