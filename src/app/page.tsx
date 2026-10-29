'use client';

import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Hero,
  InteractiveSpecimen,
  ArchitecturalPillars,
  ComparisonMatrix,
  FeatureGrid,
  FaqAccordion,
  CtaSection,
  Footer,
} from '@/components/landing';

export default function LandingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--accent-primary)] selection:text-white transition-colors duration-300">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] pointer-events-none opacity-25 blur-[180px] z-0"
        style={{
          background:
            'radial-gradient(circle, #D96B43 0%, rgba(217, 107, 67, 0.25) 45%, transparent 75%)',
        }}
      />

      <Navbar theme={theme} onToggleTheme={toggleTheme} isLoggedIn={isLoggedIn} />
      <Hero isLoggedIn={isLoggedIn} />
      <InteractiveSpecimen />
      <ArchitecturalPillars />
      <ComparisonMatrix />
      <FeatureGrid isLoggedIn={isLoggedIn} />
      <FaqAccordion />
      <CtaSection isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
}
