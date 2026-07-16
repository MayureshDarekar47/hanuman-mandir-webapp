import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanumanmandir.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/donors', '/expenses'],
        disallow: [
          '/admin',
          '/admin/',
          '/admin/login',
          '/admin/dashboard',
          '/admin/settings',
          '/api/',
          '/_next/',
        ],
      },
      {
        // Give Googlebot full access to crawlable pages
        userAgent: 'Googlebot',
        allow: ['/', '/donors', '/expenses'],
        disallow: ['/admin/', '/api/'],
        crawlDelay: 2,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

