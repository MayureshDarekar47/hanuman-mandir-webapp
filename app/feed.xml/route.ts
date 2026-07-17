import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanuman-mandir-darekarwadi.vercel.app';
  
  const [notices, events] = await Promise.all([
    prisma.notice.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.event.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
  ]);

  const items: string[] = [];

  notices.forEach(notice => {
    items.push(`
      <item>
        <title><![CDATA[${notice.seoTitle || notice.title}]]></title>
        <description><![CDATA[${notice.metaDescription || notice.subtitle || ''}]]></description>
        <link>${BASE_URL}/notices/${notice.id}</link>
        <guid isPermaLink="true">${BASE_URL}/notices/${notice.id}</guid>
        <pubDate>${new Date(notice.createdAt).toUTCString()}</pubDate>
      </item>
    `);
  });

  events.forEach(event => {
    items.push(`
      <item>
        <title><![CDATA[${event.seoTitle || event.title}]]></title>
        <description><![CDATA[${event.metaDescription || event.description || ''}]]></description>
        <link>${BASE_URL}/events/${event.id}</link>
        <guid isPermaLink="true">${BASE_URL}/events/${event.id}</guid>
        <pubDate>${new Date(event.createdAt).toUTCString()}</pubDate>
      </item>
    `);
  });

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Hanuman Mandir Darekarwadi</title>
        <link>${BASE_URL}</link>
        <description>Official updates, notices, and events from Hanuman Mandir, Darekarwadi.</description>
        <language>en</language>
        ${items.join('')}
      </channel>
    </rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
