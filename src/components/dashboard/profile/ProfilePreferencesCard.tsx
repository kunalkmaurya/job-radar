'use client';

import React, { useState, useEffect } from 'react';
import { Target, Save, Check } from 'lucide-react';

export function ProfilePreferencesCard() {
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer / Lead');
  const [locationPref, setLocationPref] = useState('Remote / Hybrid / San Francisco');
  const [targetSalary, setTargetSalary] = useState('$160,000 - $210,000');
  const [techStack, setTechStack] = useState('React, Next.js, TypeScript, Node.js, PostgreSQL');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('profile_preferences');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.targetRole) setTargetRole(parsed.targetRole);
          if (parsed.locationPref) setLocationPref(parsed.locationPref);
          if (parsed.targetSalary) setTargetSalary(parsed.targetSalary);
          if (parsed.techStack) setTechStack(parsed.techStack);
        }
      } catch {
        // Ignore JSON parse errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      'profile_preferences',
      JSON.stringify({ targetRole, locationPref, targetSalary, techStack })
    );
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <form
      onSubmit={handleSave}
      className="border border-(--border-subtle) bg-(--bg-surface) rounded-md p-5 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-(--accent-primary)" />
          <h3 className="text-xs uppercase tracking-wider font-bold text-(--text-primary)">
            Job Search & Career Target Preferences
          </h3>
        </div>
        {savedNotice && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-[11px] uppercase font-semibold text-(--text-secondary) mb-1">
            Target Job Title / Focus Role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] uppercase font-semibold text-(--text-secondary) mb-1">
              Geographic Preference
            </label>
            <input
              type="text"
              value={locationPref}
              onChange={(e) => setLocationPref(e.target.value)}
              className="w-full h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase font-semibold text-(--text-secondary) mb-1">
              Target Annual Compensation
            </label>
            <input
              type="text"
              value={targetSalary}
              onChange={(e) => setTargetSalary(e.target.value)}
              className="w-full h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase font-semibold text-(--text-secondary) mb-1">
            Primary Tech Stack & Core Skills
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) text-xs rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="h-8 inline-flex items-center gap-1.5 px-4 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) text-xs font-semibold rounded-sm shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      </div>
    </form>
  );
}
