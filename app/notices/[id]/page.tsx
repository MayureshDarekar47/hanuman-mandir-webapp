import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const notice = await prisma.notice.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!notice) return {};

  const title = notice.seoTitle || `${notice.title} - Temple Notice`;
  const description = notice.metaDescription || notice.subtitle || `Important notice from Hanuman Mandir Darekarwadi.`;

  return {
    title,
    description,
    keywords: notice.focusKeyword || 'temple notice, hanuman mandir news, darekarwadi updates',
    alternates: {
      canonical: notice.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/notices/${notice.id}`,
    },
    openGraph: {
      title,
      description,
      images: notice.ogImage ? [notice.ogImage] : undefined,
    },
    robots: notice.robots || 'index, follow',
  };
}

export default async function NoticeItemPage({ params }: Props) {
  const notice = await prisma.notice.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!notice) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": notice.schemaType || "NewsArticle",
    "headline": notice.seoTitle || notice.title,
    "description": notice.metaDescription || notice.subtitle || "Temple Notice",
    "datePublished": notice.createdAt.toISOString(),
    "dateModified": notice.createdAt.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Hanuman Mandir Darekarwadi",
      "url": process.env.NEXT_PUBLIC_BASE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hanuman Mandir Darekarwadi",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/icon-192.png`
      }
    }
  };

  return (
    <main className="min-h-screen py-16 sm:py-24 px-4 flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl w-full bg-white/5 p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <Link href="/#notices" className="text-orange-500 hover:underline mb-8 inline-block">
          &larr; Back to Notices
        </Link>
        <p className="text-temple-saffron font-semibold tracking-wider uppercase mb-4 text-sm">
          {notice.date 
            ? new Date(notice.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })
            : new Date(notice.createdAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          {notice.title}
        </h1>
        {notice.subtitle && (
          <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap">
            {notice.subtitle}
          </p>
        )}
      </div>
    </main>
  );
}
