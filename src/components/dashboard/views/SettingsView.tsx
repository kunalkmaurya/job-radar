'use client';

import React from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import { useSettingsManager } from '../settings/useSettingsManager';
import { SettingsLLMConfig } from '../settings/SettingsLLMConfig';
import { SettingsTelegramConfig } from '../settings/SettingsTelegramConfig';
import { SettingsThemeAppearance } from '../settings/SettingsThemeAppearance';
import { SettingsPipelineAutomation } from '../settings/SettingsPipelineAutomation';
import { SettingsAccessDataBackup } from '../settings/SettingsAccessDataBackup';

interface SettingsViewProps {
  currentUser: { email?: string; name?: string; role?: string } | null;
  onExportCSV: () => void;
  totalJobs: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export function SettingsView({
  currentUser,
  onExportCSV,
  totalJobs,
  theme = 'dark',
  onToggleTheme = () => {},
}: SettingsViewProps) {
  const {
    settings,
    updateSetting,
    saveStatus,
    isTestingApi,
    apiTestResult,
    testConnection,
    resetDefaults,
  } = useSettingsManager(theme, onToggleTheme);

  return (
    <div className="space-y-6">
      {/* Settings Top Command Header */}
      <div className="p-4 border border-(--border-subtle) bg-(--bg-surface) flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-(--accent-primary)" />
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-(--text-primary)">
              System Configuration & Telemetry Control
            </h2>
            <p className="text-[11px] text-(--text-secondary)">
              AI reasoning models, Telegram webhook ingestion, visual themes, and workspace
              governance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold self-start sm:self-auto bg-(--bg-app) px-2.5 py-1 border border-(--border-subtle)">
          <Check className="w-3.5 h-3.5" />
          <span>{saveStatus}</span>
        </div>
      </div>

      {/* 1. AI Reasoning Engine & LLM Provider */}
      <SettingsLLMConfig
        settings={settings}
        updateSetting={updateSetting}
        isTesting={isTestingApi}
        testResult={apiTestResult}
        onTestConnection={testConnection}
      />

      {/* 2. Telegram Webhook Ingestion Engine */}
      <SettingsTelegramConfig settings={settings} updateSetting={updateSetting} />

      {/* 3. Appearance, Themes & Default Views */}
      <SettingsThemeAppearance settings={settings} updateSetting={updateSetting} />

      {/* 4. Pipeline Velocity & Ingestion Rules */}
      <SettingsPipelineAutomation settings={settings} updateSetting={updateSetting} />

      {/* 5. Access Security, Neon Database & Backup */}
      <SettingsAccessDataBackup
        currentUser={currentUser}
        onExportCSV={onExportCSV}
        totalJobs={totalJobs}
        onResetDefaults={resetDefaults}
      />
    </div>
  );
}
