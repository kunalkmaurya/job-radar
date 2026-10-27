import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Job Radar',
    short_name: 'Job Radar',
    description:
      'High-speed job application pipeline, Telegram link ingestion, and interview tracker.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#0B0F17',
    theme_color: '#ea580c',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
