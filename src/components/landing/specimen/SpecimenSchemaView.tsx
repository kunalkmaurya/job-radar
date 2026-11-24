'use client';

import React from 'react';
import { ShowcaseItem } from './types';

interface SpecimenSchemaViewProps {
  selectedItem: ShowcaseItem;
  simulatedStatus: string;
}

export function SpecimenSchemaView({ selectedItem, simulatedStatus }: SpecimenSchemaViewProps) {
  return (
    <div className="border border-(--border-subtle) bg-(--bg-surface) rounded-md p-5 text-xs text-(--text-secondary) space-y-3 leading-relaxed shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-(--border-subtle)">
        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">
          {'// Normalized DeepSeek-V3 Semantic Payload'}
        </span>
        <span className="text-[11px] text-(--text-muted) font-mono">
          {selectedItem.tokensUsed} tokens consumed
        </span>
      </div>
      <pre className="text-(--text-primary) overflow-x-auto leading-relaxed pt-2 font-mono text-[11px]">
        {`{
  "company": "${selectedItem.company}",
  "role": "${selectedItem.role}",
  "link": "${selectedItem.url}",
  "location": "${selectedItem.location}",
  "salaryRange": "${selectedItem.salary}",
  "status": "${simulatedStatus}",
  "source": "${selectedItem.source}",
  "tags": ${JSON.stringify(selectedItem.tags)},
  "notes": "${selectedItem.notes}",
  "confidenceScore": 0.994,
  "telemetry": {
    "engine": "DeepSeek-V3",
    "latency": "${selectedItem.latencyMs}ms",
    "parser": "Jina-Headless-DOM-SPA"
  }
}`}
      </pre>
    </div>
  );
}
