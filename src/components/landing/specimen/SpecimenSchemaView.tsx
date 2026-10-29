'use client';

import React from 'react';
import { ShowcaseItem } from './types';

interface SpecimenSchemaViewProps {
  selectedItem: ShowcaseItem;
  simulatedStatus: string;
}

export function SpecimenSchemaView({ selectedItem, simulatedStatus }: SpecimenSchemaViewProps) {
  return (
    <div className="border border-[var(--border-subtle)] bg-[var(--bg-app)] p-6 font-mono text-xs text-[var(--text-secondary)] space-y-3 leading-relaxed">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <span className="text-emerald-400">{'// Normalized DeepSeek-V3 Semantic Payload'}</span>
        <span className="text-[var(--text-muted)]">{selectedItem.tokensUsed} tokens consumed</span>
      </div>
      <pre className="text-[var(--text-primary)] overflow-x-auto leading-relaxed pt-2">
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
