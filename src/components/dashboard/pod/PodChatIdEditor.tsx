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
      <div className="flex items-center justify-between text-[10px] text-(--text-muted)">
        <span>Chat ID: {currentChatId || 'Not connected yet'}</span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-(--accent-blue-bright) hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-2.5 h-2.5" />
          <span>{isEditing ? 'Cancel' : 'Set manually'}</span>
        </button>
      </div>

      {isEditing && (
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="-100... or @channelname"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-2.5 py-1 text-xs bg-(--bg-surface) border border-(--border-subtle) text-(--text-primary) font-mono rounded-xs focus:outline-none focus:border-(--accent-primary)"
            />
            <button
              onClick={handleSave}
              disabled={saving || disabled || !inputVal.trim()}
              className="px-2.5 py-1 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-semibold rounded-xs cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Linking...' : 'Save'}
            </button>
          </div>
          <p className="text-[10px] text-(--text-muted)">
            Supports negative chat IDs (-100...) or public usernames (@channel).
          </p>
        </div>
      )}
    </div>
  );
}
