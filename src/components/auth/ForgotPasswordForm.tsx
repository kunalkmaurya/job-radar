'use client';

import React, { useState } from 'react';
import { Mail, Loader2, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSwitchToSignIn: () => void;
}

export function ForgotPasswordForm({ onSwitchToSignIn }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to send reset link. Please check your email.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-(--text-primary)">Check your inbox</h3>
          <p className="text-xs text-(--text-secondary) leading-relaxed">
            If an account exists for{' '}
            <span className="text-(--text-primary) font-semibold">{email}</span>, a password reset
            link has been dispatched.
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="inline-flex items-center gap-1.5 text-xs text-(--accent-blue-bright) hover:underline cursor-pointer pt-2 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
      {error && (
        <div className="p-2.5 border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-(--text-secondary) leading-relaxed">
        Enter your account email below. We will send a secure link to reset your password.
      </p>

      <div className="space-y-1">
        <label className="text-[10px] text-(--text-muted) uppercase font-semibold block">
          Email Address
        </label>
        <div className="relative flex items-center">
          <Mail className="w-4 h-4 absolute left-3 text-(--text-muted) pointer-events-none" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full h-10 pl-9 pr-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs rounded-sm placeholder:text-(--text-muted) focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 mt-2 flex items-center justify-center gap-2 px-4 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) font-semibold text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send Link</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>

      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="inline-flex items-center gap-1.5 text-[11px] text-(--text-secondary) hover:text-(--text-primary) underline cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back</span>
        </button>
      </div>
    </form>
  );
}
