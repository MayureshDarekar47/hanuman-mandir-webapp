import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { prisma } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hanumanmandir.org';

export async function generateMetadata(): Promise<Metadata> {
  const [seo, activeBg] = await Promise.all([
    prisma.seoSettings.findFirst().catch(() => null),
    prisma.heroBackground.findFirst({ where: { isActive: true } }).catch(() => null),
  ]);
  const title = seo?.metaTitle || "Hanuman Mandir Darekarwadi | श्री हनुमान मंदिर";
  const description = seo?.metaDescription || "Official website of Hanuman Mandir, Darekarwadi (Dhavalpuri), Parner, Ahilyanagar. View daily aarti timings, upcoming events, temple notices, photo gallery, and make secure online donations to support temple seva.";
  const ogImageUrl = activeBg?.url || `${BASE_URL}/assets/cinematic_temple_bg.png`;
  
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: `%s | Hanuman Mandir Darekarwadi`,
    },
    description,
    keywords: seo?.keywords || "Hanuman Mandir, Darekarwadi, Dhavalpuri, Parner, Ahilyanagar, Maharashtra temple, Hanuman temple, Aarti timings, temple events, online donation, श्री हनुमान मंदिर, बजरंग बली",
    authors: [{ name: "Hanuman Mandir Darekarwadi" }],
    creator: "Hanuman Mandir Darekarwadi",
    publisher: "Hanuman Mandir Darekarwadi",
    alternates: {
      canonical: '/',
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
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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
        "@type": "HinduTemple",
        "@id": `${BASE_URL}/#temple`,
        "name": "Hanuman Mandir, Darekarwadi",
        "alternateName": "श्री हनुमान मंदिर, दरेकरवाडी",
        "description": "A historic and deeply revered Hanuman Mandir located in Darekarwadi, Dhavalpuri, Parner. A spiritual hub for daily prayers, aarti, community events, and festivals serving generations of devotees.",
        "url": BASE_URL,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Darekarwadi",
          "addressLocality": "Dhavalpuri, Parner",
          "addressRegion": "Ahilyanagar, Maharashtra",
          "postalCode": "414103",
          "addressCountry": "IN"
        },
        "image": `${BASE_URL}/assets/cinematic_temple_bg.png`,
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "05:30",
            "closes": "12:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "17:00",
            "closes": "21:00"
          }
        ],
        "hasMap": `${BASE_URL}/#map`,
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "name": "Hanuman Mandir Darekarwadi",
        "url": BASE_URL,
        "description": "Official website of Hanuman Mandir, Darekarwadi — temple timings, events, gallery and online donations.",
        "inLanguage": "en-IN"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": BASE_URL
          }
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
      <body className="bg-background text-foreground antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
