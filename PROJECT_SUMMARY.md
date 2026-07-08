# Hanuman Mandir Project Summary & Changelog

This document summarizes all the features, architecture decisions, and UI/UX improvements implemented in the Hanuman Mandir Next.js web application.

## 🏛️ Architecture & Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (configured specifically for a forced Light Theme)
- **Database:** Prisma ORM with MySQL (Configured for local use, scalable to production)
- **Authentication:** NextAuth.js (Credentials Provider) for the Admin Dashboard
- **Animations:** Framer Motion for smooth micro-interactions and scroll reveals
- **Icons:** Lucide React

## 🔐 Admin Dashboard & Capabilities
The application includes a secure admin panel protected by middleware. Admins can manage all dynamic content on the site:
- **Notices:** Add and delete notices (title and subtitle).
- **Events:** Add events with titles, dates, and descriptions.
- **Seva Records (Expenses):** Add expenses with categories, amounts, dates, and remarks.
- **Gallery:** Upload and delete images (saved locally in `public/assets`).
- **Donors:** Manually add donor records or bulk import them via CSV/Excel.
- **Aarti & Audio:** Upload `.mp3`/`.m4a` audio files with titles to populate the public audio player.

## 🌐 Public Facing Features
The public landing page is a single-page architecture with smooth scrolling, designed with a premium, bright, and warm aesthetic.

### 1. Hero Section
- Removed dark overlays in favor of a bright, warm tint to ensure readability without sacrificing the light theme vibe.
- High-quality dark typography (`text-gray-900` & `text-amber-600`).
- Framer Motion spring animations on load.

### 2. Navbar
- Re-designed as a floating, pill-shaped frosted glass component (`rounded-full`, `backdrop-blur`).
- Sticky navigation with links to all sections and public pages (Donors, Seva Records).

### 3. Events & Calendar
- **Interactive Calendar Component:** Users can navigate months and view days marked with orange dots if an event exists.
- **Event Sidebar:** Clicking a day reveals specific event details below the calendar.

### 4. Spotify-like Aarti Player
- Built a custom audio player (`AartiPlayer.tsx`) for playing devotional tracks.
- **Features:** Play/Pause, Seek Progress Bar, Skip Forward/Backward, Volume Control.
- **Micro-animations:** The album art spins like a record while playing and emits animated pulse rings. Buttons feature hover scaling and active tap states.
- **Scrollable Playlist:** Users can scroll through the available tracks dynamically fetched from the database.

### 5. Donation Section
- Premium two-column layout.
- Includes a QR code placeholder for UPI/GPay/PhonePe donations.
- Direct link to the public Donors page to ensure transparency.

### 6. Public Pages
- **`/donors`**: A dedicated page displaying total donation stats, total donor count, and a sortable table of all generous contributors.
- **`/expenses`**: A transparent public ledger showing where temple funds are utilized.

### 7. Global UI/UX Polish
- **Forced Light Theme:** Removed all dark-mode tailwind classes and enforced `color-scheme: light` in `globals.css` to prevent OS-level dark mode overrides.
- **Custom Scrollbars:** Styled custom webkit scrollbars in the global CSS to match the orange/amber theme.
- **Typography:** Switched from `next/font/google` to direct HTML `<link>` tags in `layout.tsx` to prevent build-time network timeouts behind corporate firewalls.
- **Guidelines Component:** A clean, dark-themed card section for temple rules to provide visual contrast against the light theme.

## 🚀 Deployment Readiness
- Environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) are properly configured.
- Local file upload logic is implemented but can be easily swapped for an S3 bucket or Cloudinary for production deployment.
- `package.json` dependencies have been audited and the dev server boots cleanly in ~3-4 seconds.
