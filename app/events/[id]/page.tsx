import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!event) return {};

  const title = event.seoTitle || `${event.title} - Hanuman Mandir Darekarwadi`;
  const description = event.metaDescription || event.description || `Join us for ${event.title} at Hanuman Mandir.`;

  return {
    title,
    description,
    keywords: event.focusKeyword || 'temple events, hanuman mandir festival, darekarwadi events',
    alternates: {
      canonical: event.canonicalUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/events/${event.id}`,
    },
    openGraph: {
      title,
      description,
      images: event.ogImage ? [event.ogImage] : undefined,
    },
    robots: event.robots || 'index, follow',
  };
}

export default async function EventItemPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(params.id, 10) },
  });

  if (!event) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": event.schemaType || "Event",
    "name": event.seoTitle || event.title,
    "startDate": event.date.toISOString(),
    "endDate": new Date(event.date.getTime() + 4 * 60 * 60 * 1000).toISOString(), // Assume 4 hours duration
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Hanuman Mandir Darekarwadi",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Darekarwadi, Dhavalpuri",
        "addressLocality": "Parner",
        "addressRegion": "Ahilyanagar",
        "postalCode": "414103",
        "addressCountry": "IN"
      }
    },
    "description": event.metaDescription || event.description || "Temple event at Hanuman Mandir Darekarwadi.",
    "organizer": {
      "@type": "Organization",
      "name": "Hanuman Mandir Darekarwadi",
      "url": process.env.NEXT_PUBLIC_BASE_URL
    }
  };

  return (
    <main className="min-h-screen py-16 sm:py-24 px-4 flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl w-full bg-white/5 p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <Link href="/#events" className="text-orange-500 hover:underline mb-8 inline-block">
          &larr; Back to Events
        </Link>
        <p className="text-temple-saffron font-semibold tracking-wider uppercase mb-4 text-sm">
          {new Date(event.date).toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          {event.title}
        </h1>
        {event.description && (
          <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        )}
      </div>
    </main>
  );
}
