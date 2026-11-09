'use client';

import React from 'react';
import { Palette, Sun, Moon, LayoutGrid, List } from 'lucide-react';
import { AppSettings } from './useSettingsManager';

interface SettingsThemeAppearanceProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const ACCENTS = [
  { label: 'Atlassian', color: '#0C66E4' },
  { label: 'Amber', color: '#FF8B00' },
  { label: 'Purple', color: '#6554C0' },
  { label: 'Green', color: '#36B37E' },
];

export function SettingsThemeAppearance({ settings, updateSetting }: SettingsThemeAppearanceProps) {
  return (
    <div className="p-5 border border-(--border-subtle) bg-(--bg-surface) rounded-md space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-(--border-subtle)">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-(--accent-primary)" />
          <h3 className="text-xs uppercase tracking-wider font-bold text-(--text-primary)">
            Appearance & Workspace Themes
          </h3>
        </div>
        <span className="text-[10px] text-(--text-muted) font-semibold">
          {settings.theme === 'dark' ? 'Atlassian Dark' : 'Atlassian Light'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-[10px] text-(--text-muted) block uppercase font-semibold">
            Theme Palette
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateSetting('theme', 'dark')}
              className={`p-2.5 border rounded-sm text-center transition-colors cursor-pointer ${
                settings.theme === 'dark'
                  ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-bold'
                  : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              <Moon className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Dark Theme</span>
            </button>

            <button
              type="button"
              onClick={() => updateSetting('theme', 'light')}
              className={`p-2.5 border rounded-sm text-center transition-colors cursor-pointer ${
                settings.theme === 'light'
                  ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-bold'
                  : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              <Sun className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <span className="text-xs">Light Theme</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-(--text-muted) block uppercase font-semibold">
            Default View Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateSetting('defaultView', 'list')}
              className={`p-2.5 border rounded-sm text-center transition-colors cursor-pointer ${
                settings.defaultView === 'list'
                  ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-bold'
                  : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              <List className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">List Table</span>
            </button>

            <button
              type="button"
              onClick={() => updateSetting('defaultView', 'kanban')}
              className={`p-2.5 border rounded-sm text-center transition-colors cursor-pointer ${
                settings.defaultView === 'kanban'
                  ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-bold'
                  : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Kanban Board</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-(--text-muted) block uppercase font-semibold">
            Accent Brand Color
          </label>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {ACCENTS.map((acc) => {
              const isSelected = settings.accentColor === acc.color;
              return (
                <button
                  key={acc.color}
                  type="button"
                  onClick={() => updateSetting('accentColor', acc.color)}
                  className={`p-2 border rounded-sm text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-(--accent-primary) bg-(--accent-primary-bg) font-bold'
                      : 'border-(--border-subtle) bg-(--bg-surface) opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: acc.color }}
                  />
                  <span className="text-[10px] block text-(--text-secondary) truncate">
                    {acc.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
