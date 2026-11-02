'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export function InvalidTokenState() {
  return (
    <div className="space-y-4 text-center py-4">
      <div className="w-10 h-10 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-(--text-primary)">Invalid Reset Link</h2>
        <p className="text-xs text-(--text-secondary) leading-relaxed">
          This password reset link is missing a valid security token or has already expired.
        </p>
      </div>
      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-medium transition-colors"
      >
        <span>Return to Sign In</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export function ResetSuccessState() {
  return (
    <div className="space-y-4 text-center py-4">
      <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-(--text-primary)">Password Updated</h2>
        <p className="text-xs text-(--text-secondary) leading-relaxed">
          Your password has been changed. You can now access your dashboard with your new
          credentials.
        </p>
      </div>
      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-medium transition-colors"
      >
        <span>Sign In Now</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
