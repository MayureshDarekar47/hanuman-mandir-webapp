import { Metadata } from 'next';
import Events from '@/components/Events';
import Link from 'next/link';
import { prisma } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanuman-mandir-darekarwadi.vercel.app';

export const metadata: Metadata = {
  title: 'Events & Festivals | Hanuman Mandir Darekarwadi',
  description: 'View upcoming events, festivals, and celebrations at Hanuman Mandir, Darekarwadi. Join us for Hanuman Jayanti, daily aarti, and special pujas.',
  keywords: 'hanuman mandir events, temple festivals darekarwadi, hanuman jayanti, temple puja schedule, ahilyanagar temple events',
  alternates: { canonical: `${BASE_URL}/events` },
  openGraph: {
    title: 'Events & Festivals | Hanuman Mandir Darekarwadi',
    description: 'View upcoming events, festivals, and celebrations at Hanuman Mandir, Darekarwadi.',
    url: `${BASE_URL}/events`,
    siteName: 'Hanuman Mandir Darekarwadi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events & Festivals | Hanuman Mandir Darekarwadi',
    description: 'Upcoming events and festivals at Hanuman Mandir, Darekarwadi, Maharashtra.',
  },
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    where: { date: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } },
  }).catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Upcoming Temple Events — Hanuman Mandir Darekarwadi",
    "description": "Upcoming events, festivals, and celebrations at Hanuman Mandir, Darekarwadi.",
    "url": `${BASE_URL}/events`,
    "numberOfItems": events.length,
    "itemListElement": events.map((event, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Event",
        "name": event.title,
        "startDate": event.date.toISOString(),
        "description": event.description || '',
        "url": `${BASE_URL}/events/${event.id}`,
        "location": {
          "@type": "Place",
          "name": "Hanuman Mandir Darekarwadi",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Parner",
            "addressRegion": "Ahilyanagar",
            "addressCountry": "IN",
          },
        },
      },
    })),
  };

  return (
    <main className="min-h-screen pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <ol className="flex items-center gap-2 text-sm text-gray-400">
          <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
          <li aria-hidden="true">›</li>
          <li className="text-orange-500 font-medium">Events & Festivals</li>
        </ol>
      </nav>

      <h1 className="sr-only">Temple Events and Festivals — Hanuman Mandir Darekarwadi</h1>
      <Events />
    </main>
  );
}
