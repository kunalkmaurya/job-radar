'use client';

import React, { useState } from 'react';
import { X, Loader2, Plus, Sparkles } from 'lucide-react';

interface AddPublicJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPublicJobModal({ isOpen, onClose, onSuccess }: AddPublicJobModalProps) {
  const [link, setLink] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload: Record<string, string> = { link: link.trim() };
      if (company.trim()) payload.company = company.trim();
      if (role.trim()) payload.role = role.trim();

      const res = await fetch('/api/feed/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to post public job');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md border border-(--border-subtle) bg-(--bg-surface) p-5 rounded-[8px] shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3">
          <div className="flex items-center gap-1.5 font-bold text-sm text-(--text-primary)">
            <Sparkles className="w-4 h-4 text-(--accent-blue-bright)" />
            <span>Share Opportunity with Pod</span>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-(--text-secondary) mb-1">
              Job URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://company.wd5.myworkdayjobs.com/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full h-8 bg-(--bg-app) border border-(--border-subtle) px-3 text-xs text-(--text-primary) rounded-sm focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-(--text-secondary) mb-1">
                Company (Optional)
              </label>
              <input
                type="text"
                placeholder="Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full h-8 bg-(--bg-app) border border-(--border-subtle) px-3 text-xs text-(--text-primary) rounded-sm focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-(--text-secondary) mb-1">
                Role (Optional)
              </label>
              <input
                type="text"
                placeholder="Staff Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-8 bg-(--bg-app) border border-(--border-subtle) px-3 text-xs text-(--text-primary) rounded-sm focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-(--border-subtle)">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 text-xs border border-(--border-subtle) hover:bg-(--bg-surface-hover) text-(--text-secondary) rounded-sm font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-8 inline-flex items-center gap-1.5 px-3.5 text-xs bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) font-semibold rounded-sm shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
