'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { JobStatus, JOB_STATUSES } from '@/types';
import { STATUS_CONFIG } from './statusConfig';

interface JobStatusDropdownProps {
  status: JobStatus | string;
  onChange: (newStatus: JobStatus) => void;
  className?: string;
}

export function JobStatusDropdown({ status, onChange, className = '' }: JobStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentConf = STATUS_CONFIG[status as JobStatus] || STATUS_CONFIG.Saved;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (newStatus: JobStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (newStatus !== status) {
      onChange(newStatus);
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          color: currentConf.text,
          backgroundColor: currentConf.bg,
          borderColor: currentConf.border,
        }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer hover:brightness-105 active:scale-[0.98] select-none"
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: currentConf.dot }}
        />
        <span>{status}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-150 opacity-75 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[145px] py-1 border border-(--border-subtle) bg-(--bg-surface) backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-100">
            {JOB_STATUSES.map((s) => {
              const conf = STATUS_CONFIG[s];
              const isSelected = s === status;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => handleSelect(s, e)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-(--bg-surface-hover) font-semibold'
                      : 'hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary)'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: conf.dot }}
                    />
                    <span style={{ color: isSelected ? conf.text : undefined }}>{s}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5" style={{ color: conf.text }} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
