'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ShowcaseItem } from './types';

interface SpecimenTelegramViewProps {
  selectedItem: ShowcaseItem;
}

export function SpecimenTelegramView({ selectedItem }: SpecimenTelegramViewProps) {
  return (
    <div className="border border-(--border-subtle) bg-(--bg-app) p-6 space-y-4">
      <div className="flex items-center justify-between text-xs text-(--text-muted) pb-2 border-b border-(--border-subtle)">
        <span>TELEGRAM CHANNEL INGESTION (SILENT MODE)</span>
        <span className="text-emerald-400">NOISE LEVEL: 0 dB</span>
      </div>

      <div className="max-w-md border border-(--border-subtle) bg-(--bg-surface) p-4 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-(--text-muted)">
          <span className="font-semibold text-(--text-primary)">You (Private Channel)</span>
          <span>Just now</span>
        </div>
        <div className="text-xs text-(--accent-primary) underline break-all ">
          {selectedItem.url}
        </div>
        <div className="text-[11px] text-(--text-secondary) pt-1.5 flex items-center gap-1.5 border-t border-(--border-subtle)">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Processed silently. Zero bot messages or stickers emitted.</span>
        </div>
      </div>
    </div>
  );
}
