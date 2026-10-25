import type { Metadata } from 'next';
import { Geist, Geist_Mono, Newsreader } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

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
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
