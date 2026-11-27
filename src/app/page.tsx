'use client';

import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Hero,
  LandingPreview,
  HowItWorks,
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
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
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(nextTheme);
  };

  return (
    <div className="landing-page min-h-screen bg-(--bg-app) text-(--text-primary) font-sans antialiased selection:bg-(--accent-primary) selection:text-white transition-colors duration-300 overflow-hidden">
      <div className="landing-grid" aria-hidden="true" />
      <div className="landing-orb landing-orb-one" aria-hidden="true" />
      <div className="landing-orb landing-orb-two" aria-hidden="true" />

      <Navbar theme={theme} onToggleTheme={toggleTheme} isLoggedIn={isLoggedIn} />
      <LandingPreview />
      <Hero isLoggedIn={isLoggedIn} />
      <HowItWorks />
      <FeatureGrid isLoggedIn={isLoggedIn} />
      <FaqAccordion />
      <CtaSection isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
}
