'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T> {
  value: T;
  label: string;
}

interface CustomSelectProps<T> {
  value: T;
  options: SelectOption<T>[];
  onChange: (val: T) => void;
  className?: string;
  ariaLabel?: string;
  direction?: 'down' | 'up';
}

export function CustomSelect<T extends string | number>({
  value,
  options,
  onChange,
  className = '',
  ariaLabel,
  direction = 'down',
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

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

  const handleSelect = (val: T, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(val);
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
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="inline-flex items-center justify-between gap-2 py-1 px-2.5 bg-(--bg-app) border border-(--border-subtle) hover:border-(--border-strong) text-(--text-primary) font-medium text-xs transition-colors cursor-pointer focus:outline-none focus:border-(--border-focus) select-none"
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-(--text-muted) transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-(--text-primary)' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute right-0 z-50 min-w-[130px] py-1 bg-(--bg-surface) border border-(--border-subtle) backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-100 ${
              direction === 'up' ? 'bottom-full mb-1.5' : 'top-full mt-1'
            }`}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={(e) => handleSelect(opt.value, e)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-(--accent-primary-bg) text-(--accent-primary) font-semibold'
                      : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface-hover)'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
