'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { JobStatus, JOB_STATUSES } from '@/types';
import { STATUS_CONFIG } from './statusConfig';

interface JobStatusDropdownProps {
  status: JobStatus | string;
  onChange: (newStatus: JobStatus) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function JobStatusDropdown({
  status,
  onChange,
  className = '',
  size = 'sm',
}: JobStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, direction: 'down' as 'up' | 'down' });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMd = size === 'md';
  const currentConf = STATUS_CONFIG[status as JobStatus] || STATUS_CONFIG.Saved;

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => setIsOpen(false);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('scroll', handleClose, true);
    window.addEventListener('resize', handleClose);
    document.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('scroll', handleClose, true);
      window.removeEventListener('resize', handleClose);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const isUp = window.innerHeight - rect.bottom < 220 && rect.top > 220;
      setMenuPos({
        top: isUp ? rect.top - 4 : rect.bottom + 4,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 170)),
        direction: isUp ? 'up' : 'down',
      });
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (newStatus: JobStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (newStatus !== status) onChange(newStatus);
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
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          color: currentConf.text,
          backgroundColor: currentConf.bg,
          borderColor: currentConf.border,
        }}
        className={`inline-flex items-center gap-1.5 border rounded-sm transition-colors cursor-pointer hover:opacity-90 active:scale-[0.98] select-none ${
          isMd ? 'h-8 px-2.5 text-xs font-semibold' : 'h-6 px-2 text-[11px] font-semibold'
        }`}
      >
        <span>{status}</span>
        <ChevronDown
          className={`${isMd ? 'w-3.5 h-3.5' : 'w-3 h-3'} transition-transform duration-150 opacity-70 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-transparent"
              style={{ zIndex: 99998 }}
              onClick={() => setIsOpen(false)}
            />
            <div
              style={{
                top: `${menuPos.top}px`,
                left: `${menuPos.left}px`,
                zIndex: 99999,
                transform: menuPos.direction === 'up' ? 'translateY(-100%)' : undefined,
              }}
              className="fixed min-w-40 p-1 border border-(--border-subtle) bg-(--bg-surface) rounded-md shadow-xl animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              {JOB_STATUSES.map((s) => {
                const isSelected = s === status;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => handleSelect(s, e)}
                    className={`w-full h-7 px-2.5 rounded-sm flex items-center justify-between text-xs text-left transition-colors cursor-pointer select-none ${
                      isSelected
                        ? 'bg-(--ds-background-selected) text-(--ds-text-selected) font-semibold'
                        : 'text-(--text-primary) hover:bg-(--ds-background-neutral-subtle-hover)'
                    }`}
                  >
                    <span className="truncate">{s}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
