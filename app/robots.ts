import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanuman-mandir-darekarwadi.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/timings',
          '/donation',
          '/contact',
          '/seva',
          '/gallery/',
          '/events/',
          '/notices/',
          '/aarti/',
          '/donors',
          '/expenses',
          '/privacy-policy',
          '/terms',
          '/feed.xml',
        ],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/_next/',
        ],
      },
      {
        // AI Search crawlers — allow full content access for AI overviews
        userAgent: ['GPTBot', 'Google-Extended', 'anthropic-ai', 'PerplexityBot', 'Bytespider'],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

