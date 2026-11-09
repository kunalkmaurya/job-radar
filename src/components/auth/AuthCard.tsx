'use client';

import React, { useState } from 'react';
import { Sparkles, Lock } from 'lucide-react';
import { EmailPasswordForm } from './EmailPasswordForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { GoogleOAuthButton } from './GoogleOAuthButton';

type AuthMode = 'signin' | 'signup' | 'forgot';

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <div className="border border-(--border-subtle) bg-(--bg-surface) p-7 rounded-[8px] shadow-2xl backdrop-blur-xl transition-all space-y-5">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] border border-(--accent-border) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold rounded-sm mb-1">
          <Sparkles className="w-3 h-3" />
          <span>Career Board & Job Tracker</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
          {mode === 'signin' && 'Welcome back'}
          {mode === 'signup' && 'Create your account'}
          {mode === 'forgot' && 'Reset your password'}
        </h1>
        <p className="text-xs text-(--text-secondary)">
          {mode === 'signin' &&
            'Sign in to manage your high-speed pipeline and explore opportunities'}
          {mode === 'signup' && 'Sign up to track applications and unlock automated job parsing'}
          {mode === 'forgot' && 'We will send a password recovery link to your registered email'}
        </p>
      </div>

      {mode !== 'forgot' && (
        <div className="grid grid-cols-2 p-0.5 border border-(--border-subtle) bg-(--bg-app) rounded-sm text-xs">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-1.5 font-semibold rounded-sm transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-(--bg-surface) text-(--text-primary) shadow-xs'
                : 'text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-1.5 font-semibold rounded-sm transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-(--bg-surface) text-(--text-primary) shadow-xs'
                : 'text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {mode === 'signin' && <EmailPasswordForm onForgotPassword={() => setMode('forgot')} />}

      {mode === 'signup' && <SignUpForm onSwitchToSignIn={() => setMode('signin')} />}

      {mode === 'forgot' && <ForgotPasswordForm onSwitchToSignIn={() => setMode('signin')} />}

      {mode !== 'forgot' && (
        <>
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-(--border-subtle)" />
            <span className="absolute px-2 bg-(--bg-surface) text-[10px] uppercase font-semibold text-(--text-muted)">
              or
            </span>
          </div>
          <GoogleOAuthButton />
        </>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-(--text-muted) pt-2 border-t border-(--border-subtle)">
        <Lock className="w-3 h-3 text-(--accent-primary)" />
        <span>Secure Authentication | Instant Access</span>
      </div>
    </div>
  );
}
