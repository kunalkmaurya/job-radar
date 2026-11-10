'use client';

import React from 'react';
import { Sliders, Clock, AlertTriangle } from 'lucide-react';
import { AppSettings } from './useSettingsManager';

interface SettingsAutomationProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const STALE_OPTIONS = [
  { val: 7, label: '7 Days', badge: 'High Urgency' },
  { val: 14, label: '14 Days', badge: 'Standard' },
  { val: 21, label: '21 Days', badge: 'Relaxed' },
  { val: 30, label: '30 Days', badge: 'Extended' },
];

const FOLLOWUP_OPTIONS = [
  { val: 3, label: '3 Days', badge: 'Referral' },
  { val: 5, label: '5 Days', badge: 'Workweek' },
  { val: 7, label: '7 Days', badge: 'Standard' },
  { val: 14, label: '14 Days', badge: 'Enterprise' },
];

export function SettingsPipelineAutomation({ settings, updateSetting }: SettingsAutomationProps) {
  return (
    <div className="p-5 border border-(--border-subtle) bg-(--bg-surface) rounded-md space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-(--border-subtle)">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-(--accent-primary)" />
          <h3 className="text-xs uppercase tracking-wider font-bold text-(--text-primary)">
            Pipeline Velocity & Ingestion Rules
          </h3>
        </div>
        <span className="text-[10px] text-(--text-muted) font-semibold">
          Threshold: {settings.staleDaysThreshold}d
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-[10px] text-(--text-muted) flex items-center gap-1.5 uppercase font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Stale Inactivity Flagging</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {STALE_OPTIONS.map((opt) => {
              const isSelected = settings.staleDaysThreshold === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => updateSetting('staleDaysThreshold', opt.val)}
                  className={`p-2 border rounded-sm text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-bold'
                      : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
                  }`}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[9px] text-(--text-muted)">{opt.badge}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-(--text-muted) flex items-center gap-1.5 uppercase font-semibold">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Suggested Follow-Up Interval</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {FOLLOWUP_OPTIONS.map((opt) => {
              const isSelected = settings.followUpDaysInterval === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => updateSetting('followUpDaysInterval', opt.val)}
                  className={`p-2 border rounded-sm text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-bold'
                      : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
                  }`}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[9px] text-(--text-muted)">{opt.badge}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-(--border-subtle) text-xs">
        <span className="text-[11px] text-(--text-secondary)">
          Auto-advance stage from &quot;Saved&quot; to &quot;Applied&quot; when launching job link
        </span>
        <button
          type="button"
          onClick={() => updateSetting('autoAdvanceOnLinkClick', !settings.autoAdvanceOnLinkClick)}
          className={`w-9 h-5 flex items-center p-0.5 rounded-full transition-colors cursor-pointer border ${
            settings.autoAdvanceOnLinkClick
              ? 'bg-(--accent-primary) border-(--accent-primary)'
              : 'bg-(--bg-app) border-(--border-subtle)'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.autoAdvanceOnLinkClick ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-(--border-subtle) text-xs">
        <span className="text-[11px] text-(--text-secondary)">
          Display Pod Feed in navigation tabs and sidebar
        </span>
        <button
          type="button"
          onClick={() => updateSetting('showPodFeed', !settings.showPodFeed)}
          className={`w-9 h-5 flex items-center p-0.5 rounded-full transition-colors cursor-pointer border ${
            settings.showPodFeed !== false
              ? 'bg-(--accent-primary) border-(--accent-primary)'
              : 'bg-(--bg-app) border-(--border-subtle)'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.showPodFeed !== false ? 'translate-x-4' : 'translate-x-0'}`}
          />
        </button>
      </div>
    </div>
  );
}
