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
  const [location, setLocation] = useState('');
  const [exp, setExp] = useState('');
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
      if (location.trim()) payload.location = location.trim();
      if (exp.trim()) payload.exp = exp.trim();

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
      <div className="w-full max-w-md border border-(--border-subtle) bg-(--bg-surface) p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3">
          <div className="flex items-center gap-1.5 font-bold text-sm text-(--text-primary)">
            <Sparkles className="w-4 h-4 text-(--accent-blue-bright)" />
            <span>Post to Public Feed</span>
          </div>
          <button
            onClick={onClose}
            className="text-(--text-secondary) hover:text-(--text-primary) p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-(--text-secondary) mb-1">
              Job URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://company.wd5.myworkdayjobs.com/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full bg-(--bg-app) border border-(--border-subtle) px-3 py-1.5 text-xs text-(--text-primary) focus:border-(--accent-primary) outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-(--text-secondary) mb-1">
                Company (Optional)
              </label>
              <input
                type="text"
                placeholder="Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-(--bg-app) border border-(--border-subtle) px-3 py-1.5 text-xs text-(--text-primary) focus:border-(--accent-primary) outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-(--text-secondary) mb-1">
                Role (Optional)
              </label>
              <input
                type="text"
                placeholder="Staff Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-(--bg-app) border border-(--border-subtle) px-3 py-1.5 text-xs text-(--text-primary) focus:border-(--accent-primary) outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-(--border-subtle)">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs border border-(--border-subtle) hover:bg-(--bg-surface-hover) text-(--text-secondary)"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white font-medium disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{company && role ? 'Post Job' : 'Auto-Scrape & Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

