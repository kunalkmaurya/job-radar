'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { AppSettings } from './useSettingsManager';

export const PROVIDERS = [
  { id: 'deepseek', name: 'DeepSeek', badge: 'MoE 671B', color: 'text-blue-400' },
  { id: 'openai', name: 'OpenAI', badge: 'GPT-4o', color: 'text-emerald-400' },
  { id: 'anthropic', name: 'Anthropic', badge: 'Claude 3.5', color: 'text-amber-400' },
  { id: 'groq', name: 'Groq', badge: 'Ultra-Fast', color: 'text-rose-400' },
] as const;

export const MODELS: Record<string, string[]> = {
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  openai: ['gpt-4o', 'gpt-4o-mini'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
  groq: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
};

interface ProviderCardsProps {
  currentProvider: AppSettings['llmProvider'];
  onSelectProvider: (provider: AppSettings['llmProvider']) => void;
}

export function SettingsProviderCards({ currentProvider, onSelectProvider }: ProviderCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
      {PROVIDERS.map((p) => {
        const isSelected = currentProvider === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectProvider(p.id)}
            className={`p-3 border text-left transition-all cursor-pointer ${
              isSelected
                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-bg)] shadow-xs'
                : 'border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--text-secondary)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                {p.name}
              </span>
              <Zap className={`w-3 h-3 ${p.color}`} />
            </div>
            <div className="text-[10px] text-[var(--text-muted)] mt-1">{p.badge}</div>
          </button>
        );
      })}
    </div>
  );
}
