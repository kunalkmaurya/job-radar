import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { InstallPromptBanner } from '@/components/pwa';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0D12' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Job Radar — High-Speed Application Pipeline & Tracker',
    template: '%s | Job Radar',
  },
  description:
    'Silently ingest job links from Telegram, extract structured company details with AI, and manage your job applications funnel with an enterprise-grade command center.',
  keywords: [
    'Job Radar',
    'Job Application Tracker',
    'AI Job Scraper',
    'Telegram Job Ingestion',
    'Career Pipeline',
    'Workday Scraper',
    'Greenhouse Scraper',
    'Lever Scraper',
  ],
  authors: [{ name: 'Kunal Maurya', url: 'https://job.kunalmaurya.com' }],
  creator: 'Kunal Maurya',
  metadataBase: new URL('https://job.kunalmaurya.com'),
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Job Radar',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'Job Radar — High-Speed Application Pipeline & Tracker',
    description:
      'Silently ingest job links from Telegram, extract structured company details with AI, and track your career application pipeline.',
    url: 'https://job.kunalmaurya.com',
    siteName: 'Job Radar',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'Job Radar Emblem',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Radar — High-Speed Application Pipeline & Tracker',
    description:
      'Silently ingest job links from Telegram, extract structured company details with AI, and track your career application pipeline.',
    images: ['/logo.png'],
    creator: '@kunalmaurya',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {children}
        <InstallPromptBanner />
      </body>
    </html>
  );
}
