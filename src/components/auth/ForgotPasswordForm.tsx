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
        <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-(--text-primary)">Check your inbox</h3>
          <p className="text-xs text-(--text-secondary) leading-relaxed">
            If an account exists for{' '}
            <span className="text-(--text-primary) font-medium">{email}</span>, a password reset
            link has been dispatched.
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="inline-flex items-center gap-1.5 text-xs text-(--accent-primary) hover:underline cursor-pointer pt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
      {error && (
        <div className="p-2.5 border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-(--text-secondary) leading-relaxed">
        Enter your account email below. We will send a secure link to reset your password.
      </p>

      <div className="space-y-1">
        <label className="text-[10px] text-(--text-muted) uppercase tracking-wider block">
          Email Address
        </label>
        <div className="relative flex items-center">
          <Mail className="w-3.5 h-3.5 absolute left-3 text-(--text-muted) pointer-events-none" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full pl-9 pr-3 py-2 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white font-medium text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Sending Link...</span>
          </>
        ) : (
          <>
            <span>Send Reset Link</span>
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
          <span>Back to Sign In</span>
        </button>
      </div>
    </form>
  );
}
