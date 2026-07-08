"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";

export default function Gallery({ galleryImages }: { galleryImages: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const images = galleryImages;

  const navigate = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + images.length) % images.length);
  }, [images.length]);

  // Auto-play removed so images only change on user interaction

  const goTo = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.98 }),
  };

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      id="gallery"
      aria-label="Photo Gallery"
    >
      <header className="text-center mb-12">
        <p className="text-temple-saffron font-semibold tracking-wider uppercase mb-2 text-sm">
          Photo Gallery
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Temple Darshan</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          Explore the divine beauty of Hanuman Mandir, Darekarwadi — captured through the lens of our devotees.
        </p>
      </header>

      {images.length === 0 ? (
        /* Empty state */
        <div className="w-full rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/50 flex flex-col items-center justify-center gap-4 text-gray-400 py-20">
          <ImageOff size={56} className="text-orange-200" aria-hidden="true" />
          <p className="font-medium text-lg">No photos uploaded yet.</p>
          <p className="text-sm text-gray-400">Visit the admin dashboard to upload temple photos.</p>
        </div>
      ) : (
        <>
          {/* ── Main Carousel ─────────────────────────────────────── */}
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl group"
            role="region"
            aria-roledescription="carousel"
            aria-label="Temple Images Carousel"
            style={{ height: "clamp(320px, 55vw, 680px)" }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`Hanuman Mandir Darekarwadi — temple view ${currentIndex + 1} of ${images.length}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1152px"
                  className="object-cover"
                  priority={currentIndex === 0}
                />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Caption */}
            <div className="absolute bottom-6 left-6 z-10">
              <p className="text-white/60 text-xs uppercase tracking-widest">
                {currentIndex + 1} / {images.length}
              </p>
            </div>

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-temple-saffron transition-all backdrop-blur-md z-10 shadow-lg"
                >
                  <ChevronLeft size={28} aria-hidden="true" />
                </button>

                <button
                  onClick={() => navigate(1)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-temple-saffron transition-all backdrop-blur-md z-10 shadow-lg"
                >
                  <ChevronRight size={28} aria-hidden="true" />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10"
                role="tablist"
                aria-label="Image navigation"
              >
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={idx === currentIndex}
                    aria-label={`Go to image ${idx + 1}`}
                    onClick={() => goTo(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "bg-temple-gold w-6"
                        : "bg-white/50 hover:bg-white/80 w-2"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Thumbnail Strip ────────────────────────────────────── */}
          {images.length > 1 && (
            <div
              className="mt-4 flex gap-3 overflow-x-auto pb-2 scroll-smooth"
              role="listbox"
              aria-label="Image thumbnails"
              style={{ scrollbarWidth: "none" }}
            >
              {images.map((src, idx) => (
                <button
                  key={idx}
                  role="option"
                  aria-selected={idx === currentIndex}
                  aria-label={`Select image ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 focus:outline-none ${
                    idx === currentIndex
                      ? "ring-2 ring-temple-gold ring-offset-2 ring-offset-transparent scale-105"
                      : "opacity-60 hover:opacity-90"
                  }`}
                  style={{ width: "100px", height: "68px" }}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
