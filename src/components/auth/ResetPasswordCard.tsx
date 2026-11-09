'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { InvalidTokenState, ResetSuccessState } from './ResetPasswordStates';

interface ResetPasswordCardProps {
  token: string | null;
}

export function ResetPasswordCard({ token }: ResetPasswordCardProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return <InvalidTokenState />;
  }

  if (success) {
    return <ResetSuccessState />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to reset password. The link may have expired.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
      {error && (
        <div className="p-2.5 border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-[10px] text-(--text-muted) uppercase font-semibold block">
          New Password
        </label>
        <div className="relative flex items-center">
          <Lock className="w-4 h-4 absolute left-3 text-(--text-muted) pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className="w-full h-10 pl-9 pr-9 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs rounded-sm placeholder:text-(--text-muted) focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 focus:outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 p-1 text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-(--text-muted) uppercase font-semibold block">
          Confirm New Password
        </label>
        <div className="relative flex items-center">
          <Lock className="w-4 h-4 absolute left-3 text-(--text-muted) pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
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
            <span>Updating...</span>
          </>
        ) : (
          <>
            <span>Save</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
