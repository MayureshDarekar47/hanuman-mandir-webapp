import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AartiPlayer from '@/components/AartiPlayer';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const aarti = await prisma.aarti.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!aarti) return {};

  const title = aarti.seoTitle || `${aarti.title} - Listen Online`;
  const description = aarti.metaDescription || `Listen to ${aarti.title} at Hanuman Mandir Darekarwadi.`;

  return {
    title,
    description,
    keywords: aarti.focusKeyword || 'hanuman aarti, hanuman chalisa, hanuman bhajan, darekarwadi mandir',
    alternates: {
      canonical: aarti.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/aarti/${aarti.id}`,
    },
    openGraph: {
      title,
      description,
      images: aarti.ogImage ? [aarti.ogImage] : undefined,
    },
    robots: aarti.robots || 'index, follow',
  };
}

export default async function AartiItemPage({ params }: Props) {
  const aarti = await prisma.aarti.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!aarti) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": aarti.schemaType || "MusicRecording",
    "name": aarti.seoTitle || aarti.title,
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/aarti/${aarti.id}`,
    "audio": {
      "@type": "AudioObject",
      "contentUrl": aarti.audioUrl,
      "encodingFormat": "audio/mpeg"
    },
    "byArtist": {
      "@type": "Organization",
      "name": "Hanuman Mandir Darekarwadi"
    }
  };

  const tracks = [{ id: aarti.id, title: aarti.title, audioUrl: aarti.audioUrl }];

  return (
    <main className="min-h-screen pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <Link href="/#aarti" className="text-orange-500 hover:underline mb-8 inline-block">
          &larr; Back to Aarti List
        </Link>
      </div>
      <AartiPlayer tracks={tracks} />
    </main>
  );
}
