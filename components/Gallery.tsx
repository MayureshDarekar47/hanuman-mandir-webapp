"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export default function Gallery({ galleryImages }: { galleryImages: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const images = galleryImages;

  const navigate = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + images.length) % images.length);
  }, [images.length]);

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
      className="py-2 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full max-w-[100vw] overflow-x-hidden sm:overflow-visible"
      id="gallery"
      aria-label="Photo Gallery"
    >
      <header className="text-center mb-2 sm:mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Temple Darshan</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          Explore the divine beauty of Hanuman Mandir, Darekarwadi — captured through the lens of our devotees.
        </p>
      </header>

      {images.length === 0 ? (
        /* Empty state */
        <div className="w-full rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/50 flex flex-col items-center justify-center gap-4 text-gray-400 py-16 sm:py-20">
          <ImageOff size={56} className="text-orange-200" aria-hidden="true" />
          <p className="font-medium text-lg">No photos uploaded yet.</p>
          <p className="text-sm text-gray-400">Visit the admin dashboard to upload temple photos.</p>
        </div>
      ) : (
        <div className="w-full overflow-hidden sm:overflow-visible">
          {/* ── Main Carousel ─────────────────────────────────────── */}
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl group aspect-video bg-black"
            role="region"
            aria-roledescription="carousel"
            aria-label="Temple Images Carousel"
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) * velocity.x;
                  if (swipe < -10000) {
                    navigate(1);
                  } else if (swipe > 10000) {
                    navigate(-1);
                  }
                }}
              >
                {/* Native img to bypass Next.js remote hostname restrictions for Supabase URLs */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[currentIndex]}
                  alt={`Hanuman Mandir Darekarwadi — temple view ${currentIndex + 1} of ${images.length}`}
                  className="w-full h-full object-contain pointer-events-none"
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Caption */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-10">
              <p className="text-white/60 text-xs uppercase tracking-widest font-bold">
                {currentIndex + 1} / {images.length}
              </p>
            </div>

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 text-white hover:bg-temple-saffron transition-all backdrop-blur-md z-10 shadow-xl border border-white/10"
                >
                  <ChevronLeft size={24} aria-hidden="true" />
                </button>

                <button
                  onClick={() => navigate(1)}
                  aria-label="Next image"
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 text-white hover:bg-temple-saffron transition-all backdrop-blur-md z-10 shadow-xl border border-white/10"
                >
                  <ChevronRight size={24} aria-hidden="true" />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div
                className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10"
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
                        ? "bg-temple-gold w-6 sm:w-8"
                        : "bg-white/50 hover:bg-white/90 w-2"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Thumbnail Strip ────────────────────────────────────── */}
          {images.length > 1 && (
            <div
              className="mt-4 sm:mt-5 flex w-full min-w-0 gap-2 sm:gap-4 overflow-x-auto pb-2 scroll-smooth snap-x"
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
                      : "opacity-50 hover:opacity-100"
                  }`}
                  style={{ width: "80px", height: "56px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
