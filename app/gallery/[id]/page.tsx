import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const image = await prisma.galleryImage.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!image) return {};

  const title = image.seoTitle || `Temple Darshan - Gallery Image ${image.id}`;
  const description = image.metaDescription || `View beautiful darshan of Hanuman Mandir.`;

  return {
    title,
    description,
    keywords: image.focusKeyword || 'temple darshan, hanuman mandir gallery',
    alternates: {
      canonical: image.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/gallery/${image.id}`,
    },
    openGraph: {
      title,
      description,
      images: [image.ogImage || image.url],
    },
    robots: image.robots || 'index, follow',
  };
}

export default async function GalleryItemPage({ params }: Props) {
  const image = await prisma.galleryImage.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!image) return notFound();

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": image.schemaType || "ImageObject",
    "contentUrl": image.url,
    "name": image.seoTitle || `Temple Darshan ${image.id}`,
    "description": image.metaDescription || "Beautiful image from Hanuman Mandir Darekarwadi",
    "author": {
      "@type": "Organization",
      "name": "Hanuman Mandir Darekarwadi"
    }
  };

  return (
    <main className="min-h-screen py-24 px-4 flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl w-full">
        <Link href="/#gallery" className="text-orange-500 hover:underline mb-8 inline-block">
          &larr; Back to Gallery
        </Link>
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">
          {image.seoTitle || "Temple Darshan"}
        </h1>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <Image 
            src={image.url} 
            alt={image.altText || "Hanuman Mandir Darshan"} 
            fill 
            className="object-contain bg-black/5"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
        </div>
      </div>
    </main>
  );
}
