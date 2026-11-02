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
    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
      {error && (
        <div className="p-2.5 border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-[10px] text-(--text-muted) uppercase tracking-wider block">
          New Password
        </label>
        <div className="relative flex items-center">
          <Lock className="w-3.5 h-3.5 absolute left-3 text-(--text-muted) pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className="w-full pl-9 pr-9 py-2 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 p-1 text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-(--text-muted) uppercase tracking-wider block">
          Confirm New Password
        </label>
        <div className="relative flex items-center">
          <Lock className="w-3.5 h-3.5 absolute left-3 text-(--text-muted) pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
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
            <span>Updating Password...</span>
          </>
        ) : (
          <>
            <span>Set New Password</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
