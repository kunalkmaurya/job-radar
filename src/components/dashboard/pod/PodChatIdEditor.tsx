'use client';

import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';

interface PodChatIdEditorProps {
  currentChatId?: string | null;
  onSave: (chatId: string) => Promise<boolean>;
  disabled?: boolean;
}

export function PodChatIdEditor({ currentChatId, onSave, disabled }: PodChatIdEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(currentChatId || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(inputVal);
    setSaving(false);
    if (ok) setIsEditing(false);
  };

  return (
    <div className="pt-2 border-t border-(--border-subtle) space-y-1.5">
      <div className="flex items-center justify-between text-xs text-(--text-muted)">
        <span>
          Chat ID:{' '}
          <strong className="text-(--text-primary) font-mono">
            {currentChatId || 'Not connected yet'}
          </strong>
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-(--accent-primary) hover:underline flex items-center gap-1 cursor-pointer font-medium text-xs"
        >
          <Edit3 className="w-3 h-3" />
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {isEditing && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="-100... or @channelname"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 h-8 px-2.5 text-xs bg-(--bg-surface) border border-(--border-subtle) text-(--text-primary) font-mono rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
            />
            <button
              onClick={handleSave}
              disabled={saving || disabled || !inputVal.trim()}
              className="h-8 px-3.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) text-xs font-semibold rounded-sm cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
            >
              {saving ? 'Linking...' : 'Save'}
            </button>
          </div>
          <p className="text-[11px] text-(--text-muted)">
            Supports negative group IDs (-100...) or public usernames (@channel).
          </p>
        </div>
      )}
    </div>
  );
}
