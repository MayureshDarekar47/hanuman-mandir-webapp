import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanuman-mandir-darekarwadi.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    donors, expenses, events, notices, gallery, aartis
  ] = await Promise.all([
    prisma.donor.findFirst({ orderBy: { date: 'desc' } }).catch(() => null),
    prisma.expense.findFirst({ orderBy: { date: 'desc' } }).catch(() => null),
    prisma.event.findMany({ select: { id: true, createdAt: true }, orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.notice.findMany({ select: { id: true, createdAt: true }, orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.galleryImage.findMany({ select: { id: true, createdAt: true }, orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.aarti.findMany({ select: { id: true, createdAt: true }, orderBy: { createdAt: 'desc' } }).catch(() => []),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/timings`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/donation`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/seva`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/donors`, lastModified: donors?.date ?? new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/expenses`, lastModified: expenses?.date ?? new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  events.forEach((event) => {
    sitemapEntries.push({
      url: `${BASE_URL}/events/${event.id}`,
      lastModified: event.createdAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  notices.forEach((notice) => {
    sitemapEntries.push({
      url: `${BASE_URL}/notices/${notice.id}`,
      lastModified: notice.createdAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  gallery.forEach((img) => {
    sitemapEntries.push({
      url: `${BASE_URL}/gallery/${img.id}`,
      lastModified: img.createdAt,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  });

  aartis.forEach((aarti) => {
    sitemapEntries.push({
      url: `${BASE_URL}/aarti/${aarti.id}`,
      lastModified: aarti.createdAt,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  });

  return sitemapEntries;
}
