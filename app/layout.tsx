import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { prisma } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanuman-mandir-darekarwadi.vercel.app';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export async function generateMetadata(): Promise<Metadata> {
  const [seo, activeBg] = await Promise.all([
    prisma.seoSettings.findFirst().catch(() => null),
    prisma.heroBackground.findFirst({ where: { isActive: true } }).catch(() => null),
  ]);
  const title = seo?.metaTitle || "Hanuman Mandir Darekarwadi | श्री हनुमान मंदिर";
  const description = seo?.metaDescription || "Official website of Hanuman Mandir, Darekarwadi (Dhavalpuri), Parner, Ahilyanagar. View daily aarti timings, upcoming events, temple notices, photo gallery, and make secure online donations to support temple seva.";
  const keywords = seo?.keywords || "Hanuman Mandir, Darekarwadi, Dhavalpuri, Parner, Ahilyanagar, Maharashtra temple, Hanuman temple, Aarti timings, temple events, online donation, हनुमान मंदिर, श्री हनुमान मंदिर, बजरंग बली, दरेकरवाडी, ढवळपुरी, पारनेर, अहिल्यानगर";
  const ogImageUrl = activeBg?.url || `${BASE_URL}/assets/cinematic_temple_bg.png`;
  
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: `%s | Hanuman Mandir Darekarwadi`,
    },
    description,
    keywords,
    authors: [{ name: "Hanuman Mandir Darekarwadi", url: BASE_URL }],
    creator: "Hanuman Mandir Darekarwadi",
    publisher: "Hanuman Mandir Darekarwadi",
    category: "religion",
    classification: "Hindu Temple",
    alternates: {
      canonical: '/',
      languages: {
        'en-IN': `${BASE_URL}/`,
        'mr-IN': `${BASE_URL}/`,
      },
    },
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName: "Hanuman Mandir Darekarwadi",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Hanuman Mandir Darekarwadi — श्री हनुमान मंदिर, दरेकरवाडी",
          type: "image/jpeg",
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImageUrl, alt: "Hanuman Mandir Darekarwadi" }],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'kMP7cTSmpX7T',
    },
    other: {
      // Geographic meta tags — extremely helpful for local SEO
      'geo.region': 'IN-MH',
      'geo.placename': 'Darekarwadi, Parner, Ahilyanagar, Maharashtra',
      'geo.position': '19.0000;74.5000', // approximate — update with exact coordinates
      'ICBM': '19.0000, 74.5000',
      // Content language
      'content-language': 'en-IN, mr-IN',
      // Apple mobile web app
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Hanuman Mandir',
      // MS Tile
      'msapplication-TileColor': '#ea580c',
      'msapplication-config': '/browserconfig.xml',
    },
    manifest: '/manifest.json',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await prisma.themeSettings.findFirst().catch(() => null);
  const primary = theme?.primaryColor || "#ea580c";
  const secondary = theme?.secondaryColor || "#d97706";
  const bgColor = theme?.backgroundColor || "#0f0805";
  const textColor = theme?.textColor || "#ffffff";

  // Generate JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["HinduTemple", "ReligiousOrganization", "LocalBusiness"],
        "@id": `${BASE_URL}/#temple`,
        "name": "Hanuman Mandir, Darekarwadi",
        "alternateName": ["श्री हनुमान मंदिर, दरेकरवाडी", "Shri Hanuman Mandir Darekarwadi", "हनुमान मंदिर"],
        "description": "A historic and deeply revered Hanuman Mandir located in Darekarwadi, Dhavalpuri, Parner, Ahilyanagar. A spiritual hub for daily prayers, aarti, community events, and festivals serving generations of devotees. Donations accepted via UPI.",
        "url": BASE_URL,
        "telephone": "",
        "priceRange": "Free",
        "currenciesAccepted": "INR",
        "paymentAccepted": "UPI, Cash",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Darekarwadi, Dhavalpuri",
          "addressLocality": "Parner",
          "addressRegion": "Ahilyanagar",
          "postalCode": "414103",
          "addressCountry": "IN",
          "addressCountryName": "India"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "19.0000",
          "longitude": "74.5000"
        },
        "image": `${BASE_URL}/assets/cinematic_temple_bg.png`,
        "logo": `${BASE_URL}/assets/icon-192.png`,
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "05:30",
            "closes": "12:00",
            "name": "Morning Aarti & Darshan"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "17:00",
            "closes": "21:00",
            "name": "Evening Aarti & Darshan"
          }
        ],
        "hasMap": `${BASE_URL}/#map`,
        "sameAs": [],
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Parner, Ahilyanagar, Maharashtra, India"
        },
        "knowsAbout": ["Hinduism", "Hanuman Puja", "Aarti", "Bhajan", "Temple Events"],
        "foundingDate": "1900",
        "slogan": "जय बजरंग बली",
        "potentialAction": {
          "@type": "DonateAction",
          "target": `${BASE_URL}/#donation`,
          "name": "Donate to Hanuman Mandir"
        }
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "name": "Hanuman Mandir Darekarwadi",
        "url": BASE_URL,
        "description": "Official website of Hanuman Mandir, Darekarwadi — temple timings, events, gallery and online donations.",
        "inLanguage": ["en-IN", "mr-IN"],
        "publisher": {
          "@id": `${BASE_URL}/#temple`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${BASE_URL}/?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "About", "item": `${BASE_URL}/about` },
          { "@type": "ListItem", "position": 3, "name": "Gallery", "item": `${BASE_URL}/gallery` },
          { "@type": "ListItem", "position": 4, "name": "Events", "item": `${BASE_URL}/events` },
          { "@type": "ListItem", "position": 5, "name": "Aarti", "item": `${BASE_URL}/aarti` },
          { "@type": "ListItem", "position": 6, "name": "Timings", "item": `${BASE_URL}/timings` },
          { "@type": "ListItem", "position": 7, "name": "Donate", "item": `${BASE_URL}/donation` },
          { "@type": "ListItem", "position": 8, "name": "Donors", "item": `${BASE_URL}/donors` },
          { "@type": "ListItem", "position": 9, "name": "Seva Records", "item": `${BASE_URL}/expenses` },
          { "@type": "ListItem", "position": 10, "name": "Contact", "item": `${BASE_URL}/contact` }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are the timings of Hanuman Mandir Darekarwadi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hanuman Mandir, Darekarwadi is open for darshan from 5:30 AM to 12:00 PM in the morning and 5:00 PM to 9:00 PM in the evening, every day of the week."
            }
          },
          {
            "@type": "Question",
            "name": "How can I donate to Hanuman Mandir Darekarwadi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can donate via UPI by scanning the QR code on the Donation section of our website. All donation records are publicly available for transparency."
            }
          },
          {
            "@type": "Question",
            "name": "Where is Hanuman Mandir Darekarwadi located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hanuman Mandir is located at Darekarwadi, Dhavalpuri, Taluka Parner, District Ahilyanagar (formerly Ahmednagar), Maharashtra — PIN 414103."
            }
          },
          {
            "@type": "Question",
            "name": "Can I listen to Aarti online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! You can listen to Hanuman Chalisa, Aarti and other devotional bhajans directly on our website in the Aarti section."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="alternate" type="application/rss+xml" title="Hanuman Mandir Updates" href={`${BASE_URL}/feed.xml`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --primary: ${primary};
            --secondary: ${secondary};
            --bg-color: ${bgColor};
            --text-color: ${textColor};
          }
        `}} />
      </head>
      <body className="bg-background text-foreground antialiased overflow-x-hidden">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
