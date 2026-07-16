import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanumanmandir.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch latest update times for dynamic freshness
  const [latestDonor, latestExpense] = await Promise.all([
    prisma.donor.findFirst({ orderBy: { date: 'desc' } }).catch(() => null),
    prisma.expense.findFirst({ orderBy: { date: 'desc' } }).catch(() => null),
  ]);

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/donors`,
      lastModified: latestDonor?.date ?? new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/expenses`,
      lastModified: latestExpense?.date ?? new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Section anchors — helps search engines understand page structure
    {
      url: `${BASE_URL}/#about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/#gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/#donation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/#aarti`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/#timings`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/#events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}


