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

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2.5 border rounded-sm text-center transition-colors cursor-pointer ${
        active
          ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-bold'
          : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
      }`}
    >
      {children}
    </button>
  );
}

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-[10px] text-(--text-muted) block uppercase font-semibold">
            Theme Palette
          </label>
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={settings.theme === 'dark'}
              onClick={() => updateSetting('theme', 'dark')}
            >
              <Moon className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Dark Theme</span>
            </ToggleButton>
            <ToggleButton
              active={settings.theme === 'light'}
              onClick={() => updateSetting('theme', 'light')}
            >
              <Sun className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <span className="text-xs">Light Theme</span>
            </ToggleButton>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-(--text-muted) block uppercase font-semibold">
            Pipeline Default View
          </label>
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={settings.defaultView === 'list'}
              onClick={() => updateSetting('defaultView', 'list')}
            >
              <List className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">List Table</span>
            </ToggleButton>
            <ToggleButton
              active={settings.defaultView === 'kanban'}
              onClick={() => updateSetting('defaultView', 'kanban')}
            >
              <LayoutGrid className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Kanban</span>
            </ToggleButton>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-(--text-muted) block uppercase font-semibold">
            Feed Default View
          </label>
          <div className="grid grid-cols-2 gap-2">
            <ToggleButton
              active={settings.defaultFeedView === 'list'}
              onClick={() => updateSetting('defaultFeedView', 'list')}
            >
              <List className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">List Table</span>
            </ToggleButton>
            <ToggleButton
              active={settings.defaultFeedView === 'grid'}
              onClick={() => updateSetting('defaultFeedView', 'grid')}
            >
              <LayoutGrid className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Grid Cards</span>
            </ToggleButton>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-(--text-muted) block uppercase font-semibold">
            Accent Brand Color
          </label>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {ACCENTS.map((acc) => (
              <button
                key={acc.color}
                type="button"
                onClick={() => updateSetting('accentColor', acc.color)}
                className={`p-2 border rounded-sm text-center transition-all cursor-pointer ${
                  settings.accentColor === acc.color
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
