'use client';

import React from 'react';
import { Timer, Zap, AlertTriangle, CalendarClock } from 'lucide-react';

interface VelocityCardsProps {
  stats: {
    staleCount: number;
    followUpsDue: number;
    avgDaysToInterview: number;
    weeklyRate: number;
  };
  totalScoped: number;
}

export function AnalyticsVelocityCards({ stats, totalScoped }: VelocityCardsProps) {
  const cards = [
    {
      title: 'AVG. TIME TO INTERVIEW',
      value: `${stats.avgDaysToInterview}d`,
      subtitle: 'From initial application',
      icon: Timer,
      color: 'text-[var(--ds-text-selected,#0C66E4)]',
      bg: 'border-l-2 border-l-[var(--ds-border-selected,#0C66E4)]',
    },
    {
      title: 'APPLICATION VELOCITY',
      value: `${stats.weeklyRate}/wk`,
      subtitle: `${totalScoped} active in window`,
      icon: Zap,
      color: 'text-[var(--ds-text-warning,#E2B203)]',
      bg: 'border-l-2 border-l-[var(--ds-border-warning,#E2B203)]',
    },
    {
      title: 'FOLLOW-UPS DUE',
      value: `${stats.followUpsDue}`,
      subtitle: 'Next 72h or overdue',
      icon: CalendarClock,
      color: 'text-[var(--ds-text-discovery,#8270DB)]',
      bg: 'border-l-2 border-l-[var(--ds-border-discovery,#8270DB)]',
    },
    {
      title: 'STALE / AT RISK',
      value: `${stats.staleCount}`,
      subtitle: '>14d with no status update',
      icon: AlertTriangle,
      color:
        stats.staleCount > 0
          ? 'text-[var(--ds-text-danger,#E34935)]'
          : 'text-[var(--ds-text-success,#22A06B)]',
      bg:
        stats.staleCount > 0
          ? 'border-l-2 border-l-[var(--ds-border-danger,#E34935)]'
          : 'border-l-2 border-l-[var(--ds-border-success,#22A06B)]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-0">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-4 border border-(--border-subtle) bg-(--bg-surface) rounded-sm ${card.bg} space-y-2 shadow-xs`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-(--text-muted) font-semibold">
                {card.title}
              </span>
              <Icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-(--text-primary)">{card.value}</div>
            <div className="text-[10px] text-(--text-secondary)">{card.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
}
