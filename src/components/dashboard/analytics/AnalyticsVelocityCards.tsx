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
      color: 'text-[var(--accent-primary)]',
      bg: 'border-l-2 border-l-[var(--accent-primary)]',
    },
    {
      title: 'APPLICATION VELOCITY',
      value: `${stats.weeklyRate}/wk`,
      subtitle: `${totalScoped} active in window`,
      icon: Zap,
      color: 'text-amber-400',
      bg: 'border-l-2 border-l-amber-400',
    },
    {
      title: 'FOLLOW-UPS DUE',
      value: `${stats.followUpsDue}`,
      subtitle: 'Next 72h or overdue',
      icon: CalendarClock,
      color: 'text-blue-400',
      bg: 'border-l-2 border-l-blue-400',
    },
    {
      title: 'STALE / AT RISK',
      value: `${stats.staleCount}`,
      subtitle: '>14d with no status update',
      icon: AlertTriangle,
      color: stats.staleCount > 0 ? 'text-rose-400' : 'text-emerald-400',
      bg: stats.staleCount > 0 ? 'border-l-2 border-l-rose-400' : 'border-l-2 border-l-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] ${card.bg} space-y-2 font-mono shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                {card.title}
              </span>
              <Icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{card.value}</div>
            <div className="text-[10px] text-[var(--text-secondary)]">{card.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
}
