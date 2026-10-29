'use client';

import React from 'react';
import { Palette, Sun, Moon, LayoutGrid, List } from 'lucide-react';
import { AppSettings } from './useSettingsManager';

interface SettingsThemeAppearanceProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const ACCENTS = [
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'Amber', color: '#F59E0B' },
  { label: 'Indigo', color: '#6366F1' },
  { label: 'Emerald', color: '#10B981' },
];

export function SettingsThemeAppearance({ settings, updateSetting }: SettingsThemeAppearanceProps) {
  return (
    <div className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[var(--text-primary)]">
            Appearance & Workspace Themes
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          {settings.theme === 'dark' ? 'Precision Dark' : 'Precision Light'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="space-y-1.5">
          <label className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
            Theme Palette
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateSetting('theme', 'dark')}
              className={`p-2.5 border text-center transition-colors cursor-pointer ${
                settings.theme === 'dark'
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-app)] text-[var(--accent-primary)] font-bold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Moon className="w-4 h-4 mx-auto mb-1" />
              <span className="text-[11px]">Precision Dark</span>
            </button>

            <button
              type="button"
              onClick={() => updateSetting('theme', 'light')}
              className={`p-2.5 border text-center transition-colors cursor-pointer ${
                settings.theme === 'light'
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-app)] text-[var(--accent-primary)] font-bold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sun className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              <span className="text-[11px]">Precision Light</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
            Default View Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateSetting('defaultView', 'list')}
              className={`p-2.5 border text-center transition-colors cursor-pointer ${
                settings.defaultView === 'list'
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-app)] text-[var(--accent-primary)] font-bold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <List className="w-4 h-4 mx-auto mb-1" />
              <span className="text-[11px]">List Grid</span>
            </button>

            <button
              type="button"
              onClick={() => updateSetting('defaultView', 'kanban')}
              className={`p-2.5 border text-center transition-colors cursor-pointer ${
                settings.defaultView === 'kanban'
                  ? 'border-[var(--accent-primary)] bg-[var(--bg-app)] text-[var(--accent-primary)] font-bold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mx-auto mb-1" />
              <span className="text-[11px]">Kanban</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider">
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
                  className={`p-2 border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--text-primary)] bg-[var(--bg-app)] font-bold'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-app)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 mx-auto mb-1"
                    style={{ backgroundColor: acc.color }}
                  />
                  <span className="text-[9px] block text-[var(--text-secondary)]">{acc.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
