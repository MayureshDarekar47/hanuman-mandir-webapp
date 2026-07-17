import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import Gallery from '@/components/Gallery';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanuman-mandir-darekarwadi.vercel.app';

export const metadata: Metadata = {
  title: 'Temple Gallery | Hanuman Mandir Darekarwadi',
  description: 'View the photo gallery of Hanuman Mandir, Darekarwadi. Beautiful darshan images of the temple, festivals, and celebrations captured by devotees.',
  keywords: 'hanuman mandir gallery, darekarwadi temple photos, temple darshan images, hanuman mandir photos, temple festival pictures',
  alternates: { canonical: `${BASE_URL}/gallery` },
  openGraph: {
    title: 'Temple Gallery | Hanuman Mandir Darekarwadi',
    description: 'View beautiful darshan and festival photos from Hanuman Mandir, Darekarwadi.',
    url: `${BASE_URL}/gallery`,
    siteName: 'Hanuman Mandir Darekarwadi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Temple Gallery | Hanuman Mandir Darekarwadi',
    description: 'View beautiful darshan and festival photos from Hanuman Mandir, Darekarwadi.',
  },
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []);
  const imageUrls = images.map(img => img.url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Hanuman Mandir Darekarwadi — Photo Gallery",
    "description": "Temple darshan images, festival photos and sacred moments from Hanuman Mandir, Darekarwadi.",
    "url": `${BASE_URL}/gallery`,
    "numberOfItems": images.length,
    "author": {
      "@type": "Organization",
      "name": "Hanuman Mandir Darekarwadi",
      "url": BASE_URL,
    },
    "image": imageUrls.slice(0, 5),
  };

  return (
    <main className="min-h-screen pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <ol className="flex items-center gap-2 text-sm text-gray-400">
          <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
          <li aria-hidden="true">›</li>
          <li className="text-orange-500 font-medium">Gallery</li>
        </ol>
      </nav>

      <Gallery galleryImages={imageUrls} />

      {/* Grid view of all images with individual links */}
      {images.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <h2 className="text-xl font-bold text-gray-800 mb-6">All Photos ({images.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <Link
                key={img.id}
                href={`/gallery/${img.id}`}
                className="group relative aspect-square rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
                aria-label={img.altText || `Temple photo ${idx + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.altText || `Hanuman Mandir Darekarwadi — photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
