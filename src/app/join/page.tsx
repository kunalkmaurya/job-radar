'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { JoinAuthPrompt } from './JoinAuthPrompt';

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    const checkAndJoin = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          setCheckingAuth(false);
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
        setCheckingAuth(false);

        if (!code) {
          setError('No invite code provided');
          return;
        }

        setJoining(true);
        const joinRes = await fetch('/api/workspaces/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteCode: code }),
        });
        const joinData = await joinRes.json();
        if (!joinRes.ok) {
          throw new Error(joinData.error || 'Failed to join workspace');
        }

        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 1500);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to join workspace');
      } finally {
        setJoining(false);
      }
    };

    void checkAndJoin();
  }, [code, router]);

  return (
    <div className="min-h-screen bg-(--bg-app) flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-(--bg-surface) border border-(--border-subtle) rounded-lg p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-(--accent-primary-bg) border border-(--border-subtle) flex items-center justify-center p-1 rounded-xs">
            <Image
              src="/logo.png"
              alt="Job Radar"
              width={20}
              height={20}
              className="w-4 h-4 object-contain"
            />
          </div>
          <span className="font-bold text-xs tracking-wider uppercase text-(--text-primary)">
            JOB RADAR PODS
          </span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-lg font-bold text-(--text-primary)">Join Peer Job Pod</h1>
          <p className="text-xs text-(--text-muted) leading-relaxed">
            Collaborate with peers, pool job listings straight from Telegram, and track applications
            together.
          </p>
        </div>

        {checkingAuth || joining ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-(--text-muted)">
            <Loader2 className="w-5 h-5 animate-spin text-(--accent-primary)" />
            <span>{checkingAuth ? 'Checking membership...' : 'Connecting to pod...'}</span>
          </div>
        ) : success ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-medium">Joined pod successfully. Redirecting...</span>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xs flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Link
              href="/dashboard"
              className="w-full py-2 bg-(--bg-app) hover:bg-(--bg-surface-hover) border border-(--border-subtle) text-xs text-(--text-primary) font-medium rounded-xs flex items-center justify-center"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : !isAuthenticated ? (
          <JoinAuthPrompt code={code} />
        ) : null}
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-(--bg-app) flex items-center justify-center text-xs text-(--text-muted)">
          Loading invitation...
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  );
}
