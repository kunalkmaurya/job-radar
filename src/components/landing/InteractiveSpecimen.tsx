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
    <section id="interactive-showcase" className="w-full px-6 py-20 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 relative">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Section Title & Target Preset Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Live Interactive Specimen</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-[var(--text-primary)]">
              From Telegram URL to structured pipeline card.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1 text-xs font-mono">
            {SHOWCASE_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectPreset(item)}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  selectedItem.id === item.id
                    ? 'bg-[var(--accent-primary)] text-white font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.company}
              </button>
            ))}
          </div>
        </div>

        {/* Window Shell Container */}
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden">
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

          <div className="p-6 md:p-8 relative min-h-[380px]">
            {isSimulating ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 font-mono text-xs text-[var(--text-secondary)]">
                <Sparkles className="w-6 h-6 text-[var(--accent-primary)] animate-spin" />
                <span>Hydrating DOM & Extracting Semantic Schema...</span>
              </div>
            ) : activeTab === 'board' ? (
              <SpecimenBoardView
                selectedItem={selectedItem}
                simulatedStatus={simulatedStatus}
                onSelectStatus={setSimulatedStatus}
              />
            ) : activeTab === 'extraction' ? (
              <SpecimenSchemaView
                selectedItem={selectedItem}
                simulatedStatus={simulatedStatus}
              />
            ) : (
              <SpecimenTelegramView selectedItem={selectedItem} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
