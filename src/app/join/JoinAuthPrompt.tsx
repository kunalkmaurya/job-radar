'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';

interface JoinAuthPromptProps {
  code: string;
}

export function JoinAuthPrompt({ code }: JoinAuthPromptProps) {
  const loginRedirect = `/login?callbackUrl=${encodeURIComponent(`/join?code=${code}`)}`;
  const registerRedirect = `/register?callbackUrl=${encodeURIComponent(`/join?code=${code}`)}`;

  return (
    <div className="space-y-3 pt-2">
      <div className="p-3 bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] border border-(--accent-border) rounded-sm text-xs text-[var(--ds-text-selected,#0C66E4)] flex items-center gap-2">
        <Users className="w-4 h-4 text-[var(--ds-text-selected,#0C66E4)] shrink-0" />
        <span>Sign in or register to accept your peer&apos;s invitation.</span>
      </div>
      <div className="flex gap-2">
        <Link
          href={loginRedirect}
          className="flex-1 h-8 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) text-xs font-semibold rounded-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={registerRedirect}
          className="flex-1 h-8 bg-(--bg-app) hover:bg-(--bg-surface-hover) border border-(--border-subtle) text-xs text-(--text-primary) font-semibold rounded-sm flex items-center justify-center transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
