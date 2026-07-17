import { Metadata } from 'next';
import Aarti from '@/components/Aarti';
import Link from 'next/link';
import { prisma } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanuman-mandir-darekarwadi.vercel.app';

export const metadata: Metadata = {
  title: 'Hanuman Aarti & Bhajans Online | Hanuman Mandir Darekarwadi',
  description: 'Listen to Hanuman Aarti, Hanuman Chalisa, and devotional bhajans online from Hanuman Mandir, Darekarwadi. Stream sacred audio tracks anytime, anywhere.',
  keywords: 'hanuman aarti online, hanuman chalisa audio, hanuman bhajan, aarti darekarwadi, mandir audio stream, hanuman mandir music',
  alternates: { canonical: `${BASE_URL}/aarti` },
  openGraph: {
    title: 'Hanuman Aarti & Bhajans Online | Hanuman Mandir Darekarwadi',
    description: 'Listen to Hanuman Aarti, Hanuman Chalisa, and devotional bhajans online.',
    url: `${BASE_URL}/aarti`,
    siteName: 'Hanuman Mandir Darekarwadi',
    type: 'music.playlist',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hanuman Aarti & Bhajans Online | Hanuman Mandir Darekarwadi',
    description: 'Listen to Hanuman Aarti and bhajans from Hanuman Mandir Darekarwadi.',
  },
};

export default async function AartiPage() {
  const aartis = await prisma.aarti.findMany({ orderBy: { createdAt: 'asc' } }).catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    "name": "Hanuman Aarti & Bhajans — Hanuman Mandir Darekarwadi",
    "description": "Sacred audio collection of Hanuman Aarti, Chalisa, and bhajans from Hanuman Mandir, Darekarwadi.",
    "url": `${BASE_URL}/aarti`,
    "numTracks": aartis.length,
    "track": aartis.map((aarti, idx) => ({
      "@type": "MusicRecording",
      "position": idx + 1,
      "name": aarti.title,
      "url": `${BASE_URL}/aarti/${aarti.id}`,
      "audio": {
        "@type": "AudioObject",
        "contentUrl": aarti.audioUrl,
        "encodingFormat": "audio/mpeg",
      },
      "byArtist": {
        "@type": "Organization",
        "name": "Hanuman Mandir Darekarwadi",
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
          <li className="text-orange-500 font-medium">Aarti & Bhajans</li>
        </ol>
      </nav>

      <h1 className="sr-only">Hanuman Aarti and Bhajans — Listen Online — Hanuman Mandir Darekarwadi</h1>
      <Aarti />

      {/* Individual track links for Google indexing */}
      {aartis.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-16">
          <h2 className="text-lg font-bold text-gray-700 mb-4">All Tracks</h2>
          <ol className="space-y-2">
            {aartis.map((aarti, idx) => (
              <li key={aarti.id}>
                <Link
                  href={`/aarti/${aarti.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-orange-100 hover:border-orange-400 hover:shadow-md transition-all group"
                  aria-label={`Listen to ${aarti.title}`}
                >
                  <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">{aarti.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
