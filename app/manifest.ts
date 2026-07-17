import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hanuman Mandir Darekarwadi',
    short_name: 'Hanuman Mandir',
    description: 'Official app for Hanuman Mandir Darekarwadi',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0805',
    theme_color: '#ea580c',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
