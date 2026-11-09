'use client';

import React, { useState } from 'react';
import { Terminal, Sparkles } from 'lucide-react';
import { ShowcaseItem, SpecimenTab } from './specimen/types';
import { SHOWCASE_ITEMS } from './specimen/data';
import { SpecimenHeader } from './specimen/SpecimenHeader';
import { SpecimenInputBar } from './specimen/SpecimenInputBar';
import { SpecimenBoardView } from './specimen/SpecimenBoardView';
import { SpecimenSchemaView } from './specimen/SpecimenSchemaView';
import { SpecimenTelegramView } from './specimen/SpecimenTelegramView';

export function InteractiveSpecimen() {
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem>(SHOWCASE_ITEMS[0]);
  const [simulatedStatus, setSimulatedStatus] = useState<string>('Saved');
  const [activeTab, setActiveTab] = useState<SpecimenTab>('board');
  const [isSimulating, setIsSimulating] = useState(false);
  const [customInputUrl, setCustomInputUrl] = useState('');

  const handleSelectPreset = (item: ShowcaseItem) => {
    setSelectedItem(item);
    setSimulatedStatus('Saved');
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 450);
  };

  const handleSimulateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    setIsSimulating(true);

    const domain = customInputUrl.replace(/^https?:\/\//, '').split('/')[0];
    const companyGuess = domain.split('.')[0];
    const formattedCompany = companyGuess.charAt(0).toUpperCase() + companyGuess.slice(1);

    setTimeout(() => {
      setSelectedItem({
        id: 'custom-' + Date.now(),
        company: formattedCompany || 'Custom Target',
        role: 'Senior Technical Lead — Product Engineering',
        url: customInputUrl,
        location: 'Remote / Global',
        salary: 'Market Competitive Compensation',
        source: domain,
        tags: ['Distributed Systems', 'Modern Stack', 'Full-Lifecycle'],
        notes: 'Captured via live custom simulation URL.',
        latencyMs: 620,
        tokensUsed: 1390,
      });
      setIsSimulating(false);
      setSimulatedStatus('Saved');
    }, 550);
  };

  return (
    <section
      id="interactive-showcase"
      className="w-full px-6 py-20 border-t border-(--border-subtle) bg-(--bg-surface)/40 relative"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs text-(--accent-primary) uppercase tracking-widest font-semibold mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Live Interactive Specimen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
              From Telegram URL to structured pipeline card.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border border-(--border-subtle) bg-(--bg-app) p-1 text-xs rounded-sm">
            {SHOWCASE_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectPreset(item)}
                className={`h-7 px-3 text-xs font-semibold transition-colors cursor-pointer border rounded-sm ${
                  selectedItem.id === item.id
                    ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) shadow-xs'
                    : 'border-transparent bg-transparent text-(--text-secondary) hover:text-(--text-primary)'
                }`}
              >
                {item.company}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-(--border-subtle) bg-(--bg-surface) rounded-md shadow-xl overflow-hidden">
          <SpecimenHeader
            selectedItem={selectedItem}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />

          <SpecimenInputBar
            customInputUrl={customInputUrl}
            onChangeUrl={setCustomInputUrl}
            onSubmit={handleSimulateCustom}
            latencyMs={selectedItem.latencyMs}
          />

          <div className="p-5 md:p-6 bg-(--bg-app)/40 relative min-h-[380px]">
            {isSimulating ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-xs text-(--text-secondary)">
                <Sparkles className="w-6 h-6 text-(--accent-primary) animate-spin" />
                <span>Hydrating DOM & Extracting Semantic Schema...</span>
              </div>
            ) : activeTab === 'board' ? (
              <SpecimenBoardView
                selectedItem={selectedItem}
                simulatedStatus={simulatedStatus}
                onSelectStatus={setSimulatedStatus}
              />
            ) : activeTab === 'extraction' ? (
              <SpecimenSchemaView selectedItem={selectedItem} simulatedStatus={simulatedStatus} />
            ) : (
              <SpecimenTelegramView selectedItem={selectedItem} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
