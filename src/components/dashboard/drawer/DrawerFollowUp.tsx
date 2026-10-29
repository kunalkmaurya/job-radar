'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DrawerFollowUpProps {
  value: string;
  nowTime: number;
  onChange: (date: string) => void;
}

export function DrawerFollowUp({ value, nowTime, onChange }: DrawerFollowUpProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-(--text-secondary) flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" />
        <span>Follow-up Reminder Date</span>
      </label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value}
          onClick={(e) => {
            try {
              e.currentTarget.showPicker?.();
            } catch {}
          }}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) focus:outline-none focus:border-(--border-focus) cursor-pointer"
        />
        <button
          onClick={() => {
            const d = new Date(nowTime + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0];
            onChange(d);
          }}
          className="px-2 py-1.5 border border-(--border-subtle) text-[11px] hover:bg-(--bg-surface-hover) cursor-pointer"
        >
          +3d
        </button>
        <button
          onClick={() => {
            const d = new Date(nowTime + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0];
            onChange(d);
          }}
          className="px-2 py-1.5 border border-(--border-subtle) text-[11px] hover:bg-(--bg-surface-hover) cursor-pointer"
        >
          +1w
        </button>
      </div>
    </div>
  );
}
