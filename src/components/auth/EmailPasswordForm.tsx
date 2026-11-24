'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

interface EmailPasswordFormProps {
  onForgotPassword?: () => void;
}

export function EmailPasswordForm({ onForgotPassword }: EmailPasswordFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      router.push(data.redirect || '/dashboard');
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

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-(--text-muted) uppercase font-semibold block">
            Password
          </label>
          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[11px] text-(--accent-blue-bright) hover:underline cursor-pointer font-medium"
            >
              Forgot password?
            </button>
          )}
        </div>
        <div className="relative flex items-center">
          <Lock className="w-4 h-4 absolute left-3 text-(--text-muted) pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 mt-2 flex items-center justify-center gap-2 px-4 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) font-semibold text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
