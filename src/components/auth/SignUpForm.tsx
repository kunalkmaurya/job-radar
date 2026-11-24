'use client';

import React from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useSignUp } from './useSignUp';

interface SignUpFormProps {
  onSwitchToSignIn?: () => void;
}

export function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    handleSubmit,
  } = useSignUp();

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
          Full Name
        </label>
        <div className="relative flex items-center">
          <User className="w-4 h-4 absolute left-3 text-(--text-muted) pointer-events-none" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full h-10 pl-9 pr-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs rounded-sm placeholder:text-(--text-muted) focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 focus:outline-none transition-all"
          />
        </div>
      </div>

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
        <label className="text-[10px] text-(--text-muted) uppercase font-semibold block">
          Password
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
          Confirm Password
        </label>
        <div className="relative flex items-center">
          <Lock className="w-4 h-4 absolute left-3 text-(--text-muted) pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
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
            <span>Registering...</span>
          </>
        ) : (
          <>
            <span>Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>

      {onSwitchToSignIn && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-[11px] text-(--text-secondary) hover:text-(--text-primary) underline cursor-pointer"
          >
            Already have an account? Sign in
          </button>
        </div>
      )}
    </form>
  );
}
