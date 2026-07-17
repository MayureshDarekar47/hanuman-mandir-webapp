import { Metadata } from 'next';
import Notices from '@/components/Notices';
import Link from 'next/link';
import { prisma } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanuman-mandir-darekarwadi.vercel.app';

export const metadata: Metadata = {
  title: 'Notices & Announcements | Hanuman Mandir Darekarwadi',
  description: 'Read the latest notices and announcements from Hanuman Mandir, Darekarwadi. Stay updated with temple news, special events, and important information for devotees.',
  keywords: 'hanuman mandir notices, temple announcements darekarwadi, mandir news ahilyanagar, temple updates maharashtra',
  alternates: { canonical: `${BASE_URL}/notices` },
  openGraph: {
    title: 'Notices & Announcements | Hanuman Mandir Darekarwadi',
    description: 'Latest notices and announcements from Hanuman Mandir, Darekarwadi.',
    url: `${BASE_URL}/notices`,
    siteName: 'Hanuman Mandir Darekarwadi',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Notices & Announcements | Hanuman Mandir Darekarwadi',
    description: 'Latest notices and announcements from Hanuman Mandir, Darekarwadi.',
  },
};

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Temple Notices — Hanuman Mandir Darekarwadi",
    "description": "Latest announcements and notices from Hanuman Mandir, Darekarwadi.",
    "url": `${BASE_URL}/notices`,
    "numberOfItems": notices.length,
    "itemListElement": notices.map((notice, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "NewsArticle",
        "headline": notice.title,
        "description": notice.subtitle || '',
        "url": `${BASE_URL}/notices/${notice.id}`,
        "datePublished": notice.createdAt.toISOString(),
        "author": {
          "@type": "Organization",
          "name": "Hanuman Mandir Darekarwadi",
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
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <ol className="flex items-center gap-2 text-sm text-gray-400">
          <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
          <li aria-hidden="true">›</li>
          <li className="text-orange-500 font-medium">Notices</li>
        </ol>
      </nav>

      <h1 className="sr-only">Temple Notices and Announcements — Hanuman Mandir Darekarwadi</h1>
      <Notices />

      {/* All notices with individual links */}
      {notices.length > 5 && (
        <section className="max-w-4xl mx-auto px-4 pb-24">
          <h2 className="text-xl font-bold text-gray-800 mb-6">All Notices</h2>
          <ul className="space-y-3">
            {notices.slice(5).map(notice => (
              <li key={notice.id}>
                <Link
                  href={`/notices/${notice.id}`}
                  className="block p-4 bg-white border-l-4 border-l-orange-400 rounded-r-2xl shadow-sm hover:shadow-md hover:border-l-orange-600 transition-all"
                >
                  <p className="font-bold text-gray-900">{notice.title}</p>
                  {notice.subtitle && <p className="text-gray-500 text-sm mt-1">{notice.subtitle}</p>}
                  <p className="text-xs text-orange-500 mt-2">
                    {new Date(notice.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
