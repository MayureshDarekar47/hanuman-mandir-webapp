"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface HeroProps {
  bgUrl?: string;
  mobileBgUrl?: string;
  siteSettings?: any;
  animationSettings?: any;
}

export default function Hero({ bgUrl, mobileBgUrl, siteSettings, animationSettings }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const animEnabled = animationSettings?.enableAnimations ?? true;
  const speed = animationSettings?.speedMultiplier ?? 1.0;
  const enableParallax = animEnabled && (animationSettings?.enableParallax ?? true);
  const enableFog = animEnabled && (animationSettings?.enableFog ?? true);
  const enableParticles = animEnabled && (animationSettings?.enableParticles ?? true);
  const enableFlowers = animEnabled && (animationSettings?.enableFlowers ?? true);
  const enableGlow = animEnabled && (animationSettings?.enableGlow ?? true);
  const enableLeaves = animEnabled && (animationSettings?.enableLeaves ?? false);
  const enableSmoke = animEnabled && (animationSettings?.enableSmoke ?? false);
  const enableSparkles = animEnabled && (animationSettings?.enableSparkles ?? false);
  const intensity = animationSettings?.intensityMultiplier ?? 1.0;

  const numParticles = Math.max(0, Math.round(15 * intensity));
  const numFlowers = Math.max(0, Math.round(12 * intensity));
  const numLeaves = Math.max(0, Math.round(15 * intensity));
  const numSparkles = Math.max(0, Math.round(25 * intensity));

  // Max 10px parallax movement
  const backgroundX = useTransform(mouseX, [-1, 1], enableParallax ? [-10, 10] : [0, 0]);
  const backgroundY = useTransform(mouseY, [-1, 1], enableParallax ? [-10, 10] : [0, 0]);

  const contentX = useTransform(mouseX, [-1, 1], enableParallax ? [-15, 15] : [0, 0]);
  const contentY = useTransform(mouseY, [-1, 1], enableParallax ? [-15, 15] : [0, 0]);

  const defaultBg = "/assets/cinematic_temple_bg.png";
  const activeImage = (isMobile && mobileBgUrl) ? mobileBgUrl : (bgUrl || defaultBg);

  return (
    <section aria-label="Hero Section" className="relative min-h-[450px] sm:min-h-[500px] lg:min-h-[700px] 2xl:min-h-[800px] w-full flex items-center justify-center overflow-hidden bg-[#0f0805]" id="home">

      {/* Heat Haze disabled for performance */}

      {/* 1. Base Image with Parallax, Slow Ken Burns & Cinematic Filters */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 origin-center scale-[1.05]"
        style={{
          backgroundImage: `url('${activeImage}')`,
          filter: "contrast(1.1) sepia(0.15) saturate(0.95)",
          x: backgroundX,
          y: backgroundY,
        }}
        animate={animEnabled ? { scale: [1.0, 1.08, 1.0] } : {}}
        transition={{ duration: 60 / speed, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft Heat Haze Overlay (Simplified for performance) */}
      {enableFog && (
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-40 bg-orange-900/10 mix-blend-overlay"
          aria-hidden="true"
        />
      )}

      {/* 3. Cinematic Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(15,8,5,0.82) 0%, rgba(45,20,10,0.55) 50%, rgba(120,60,20,0.25) 100%)"
        }}
        aria-hidden="true"
      />

      {/* 4. Animated Vignette */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply"
        style={{ background: "radial-gradient(circle, transparent 40%, #0a0500 120%)" }}
        animate={animEnabled ? { opacity: [0.8, 0.95, 0.8] } : {}}
        transition={{ duration: 15 / speed, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* 5. Animated Warm Glow Behind Temple (Center) */}
      {enableGlow && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
          style={{
            background: "radial-gradient(circle at center, rgba(255,200,100,0.15) 0%, transparent 60%)",
          }}
          animate={animEnabled ? { opacity: [0.9, 1.0, 0.9], scale: [0.98, 1.02, 0.98] } : {}}
          transition={{ duration: 10 / speed, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}

      {/* 6. Sunlight / God Rays (Top Right) */}
      {enableGlow && (
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-[200%] h-[200%] origin-top-right z-10 pointer-events-none mix-blend-screen opacity-40"
          style={{
            background: "conic-gradient(from 180deg at 100% 0%, transparent 0deg, rgba(255, 230, 150, 0.12) 15deg, transparent 30deg, rgba(255, 220, 120, 0.08) 45deg, transparent 60deg)"
          }}
          animate={animEnabled ? { rotate: [0, 5, -3, 0] } : {}}
          transition={{ duration: 30 / speed, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}

      {/* 7. Morning Mist / Fog */}
      {enableFog && (
        <>
          <motion.div
            className="absolute bottom-0 left-[-20%] right-[-20%] h-3/5 z-10 pointer-events-none opacity-30 mix-blend-screen"
            style={{
              background: "radial-gradient(ellipse at 50% 100%, rgba(255,230,200,0.15), transparent 70%)",
            }}
            animate={animEnabled ? { x: ["-2%", "2%", "-2%"], opacity: [0.2, 0.4, 0.2] } : {}}
            transition={{ duration: 25 / speed, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1/3 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(15, 8, 5, 0.9) 0%, transparent 100%)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* 8. Light Sweep */}
      {enableGlow && (
        <motion.div
          className="absolute top-0 bottom-0 w-[200%] -left-[100%] z-10 pointer-events-none mix-blend-screen opacity-20"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 200, 100, 0.15), transparent)",
            transform: "skewX(-30deg)"
          }}
          animate={animEnabled ? { x: ["0%", "200%"] } : {}}
          transition={{ duration: 6 / speed, delay: 15 / speed, repeat: Infinity, repeatDelay: 20 / speed, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}

      {/* 9. Floating dust particles & Glowing particles */}
      {mounted && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden" aria-hidden="true">
          {enableParticles && Array.from({ length: numParticles }).map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              className="absolute rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,220,120,0.6)]"
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
              }}
              animate={animEnabled ? {
                y: [0, Math.random() * -100 - 30],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0, Math.random() * 0.4 + 0.2, 0],
                scale: [0.5, 1, 0.5]
              } : {}}
              transition={{
                duration: (Math.random() * 15 + 15) / speed,
                repeat: Infinity,
                delay: (Math.random() * 10) / speed,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Floating Marigold & Rose Petals */}
          {enableFlowers && Array.from({ length: numFlowers }).map((_, i) => {
            const isMarigold = Math.random() > 0.4;
            const size = Math.random() * 8 + 6;
            return (
              <motion.div
                key={`petal-${i}`}
                className="absolute shadow-sm"
                style={{
                  width: size + "px",
                  height: size * 0.8 + "px",
                  top: -20,
                  left: Math.random() * 100 + "%",
                  background: isMarigold
                    ? "radial-gradient(circle, rgba(255,160,0,0.9), rgba(255,100,0,0.8))" // Orange/Yellow
                    : "radial-gradient(circle, rgba(220,20,60,0.9), rgba(150,10,30,0.8))", // Red rose
                  borderRadius: isMarigold ? "40% 60% 70% 30% / 40% 50% 60% 50%" : "50% 0 50% 50%",
                }}
                animate={animEnabled ? {
                  y: [0, window.innerHeight + 50],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1)],
                  opacity: [0, 0.8, 0.8, 0]
                } : {}}
                transition={{
                  duration: (Math.random() * 20 + 20) / speed, // Slow falling
                  repeat: Infinity,
                  delay: (Math.random() * 30) / speed,
                  ease: "linear"
                }}
              />
            );
          })}

          {/* Falling Sacred Leaves */}
          {enableLeaves && Array.from({ length: numLeaves }).map((_, i) => {
            const size = Math.random() * 10 + 10;
            return (
              <motion.div
                key={`leaf-${i}`}
                className="absolute shadow-sm"
                style={{
                  width: size + "px",
                  height: size * 1.5 + "px",
                  top: -30,
                  left: Math.random() * 100 + "%",
                  background: "linear-gradient(135deg, rgba(34,139,34,0.9), rgba(0,100,0,0.8))",
                  borderRadius: "50% 0 50% 0",
                }}
                animate={animEnabled ? {
                  y: [0, typeof window !== 'undefined' ? window.innerHeight + 50 : 1000],
                  x: [0, (Math.random() - 0.5) * 300],
                  rotate: [0, Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1)],
                  opacity: [0, 0.9, 0.9, 0]
                } : {}}
                transition={{
                  duration: (Math.random() * 25 + 25) / speed,
                  repeat: Infinity,
                  delay: (Math.random() * 40) / speed,
                  ease: "linear"
                }}
              />
            );
          })}

          {/* Golden Sparkles */}
          {enableSparkles && Array.from({ length: numSparkles }).map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute bg-yellow-200"
              style={{
                width: Math.random() * 3 + 2 + "px",
                height: Math.random() * 3 + 2 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                boxShadow: "0 0 10px 2px rgba(255, 215, 0, 0.8)"
              }}
              animate={animEnabled ? {
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
                rotate: [0, 180]
              } : {}}
              transition={{
                duration: (Math.random() * 2 + 1) / speed,
                repeat: Infinity,
                delay: (Math.random() * 5) / speed,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Aarti Smoke (Fog) */}
          {enableSmoke && Array.from({ length: Math.max(0, Math.round(5 * intensity)) }).map((_, i) => (
            <motion.div
              key={`smoke-${i}`}
              className="absolute bottom-[0%] rounded-full blur-3xl mix-blend-screen pointer-events-none"
              style={{
                width: Math.random() * 300 + 200 + "px",
                height: Math.random() * 300 + 200 + "px",
                left: Math.random() * 80 + 10 + "%",
                background: "radial-gradient(circle, rgba(200, 200, 200, 0.15) 0%, transparent 70%)"
              }}
              animate={animEnabled ? {
                y: [0, Math.random() * -400 - 200],
                x: [0, (Math.random() - 0.5) * 200],
                opacity: [0, Math.random() * 0.3 + 0.1, 0],
                scale: [1, Math.random() * 2 + 1.5]
              } : {}}
              transition={{
                duration: (Math.random() * 20 + 20) / speed,
                repeat: Infinity,
                delay: (Math.random() * 15) / speed,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* 10. Foreground Content */}
      <article className="relative z-30 w-full">
        <motion.div
          className="text-center px-4 flex flex-col items-center mt-32 sm:mt-16"
          style={{ x: contentX, y: contentY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 / speed, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2 sm:mb-4 flex gap-4 sm:gap-6 text-amber-400 text-2xl sm:text-3xl font-black drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]"
            aria-label="Sanskrit Quote"
          >
            <span>{siteSettings?.heroQuote || "ॐ जय बजरंग बली ॐ"}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4 / speed, delay: 0.2 / speed, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-6xl md:text-8xl font-black text-white tracking-tight mb-2 sm:mb-3 drop-shadow-[0_5px_25px_rgba(0,0,0,0.8)]"
          >
            {siteSettings?.heroTitle || "Hanuman Mandir"}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 / speed, delay: 0.35 / speed, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl sm:text-3xl md:text-5xl font-extrabold text-orange-400 mb-3 sm:mb-4 drop-shadow-[0_3px_15px_rgba(0,0,0,0.7)]"
          >
            {siteSettings?.heroSubtitle || "हनुमान मंदिर"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 / speed, delay: 0.5 / speed, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-xl md:text-2xl text-amber-50 font-bold bg-black/30 px-4 sm:px-6 py-2.5 rounded-full border border-orange-400/20 shadow-lg backdrop-blur-md break-words whitespace-normal text-center max-w-[90vw]"
          >
            {siteSettings?.heroLocation || "दरेकरवाडी,ढवळपुरी,पारनेर,अहिल्यानगर"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 / speed, delay: 0.7 / speed, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center w-[85%] sm:w-full mx-auto"
          >
            <a href="#about" aria-label="Explore Temple" className="w-auto px-8 py-3 text-sm font-bold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_35px_rgba(234,88,12,0.5)] hover:-translate-y-1 transition-all duration-300 ring-1 ring-orange-400/50 text-center">
              Explore Temple
            </a>
            <a href="#donation" aria-label="Donate Now" className="w-auto px-8 py-3 text-sm font-bold bg-black/40 hover:bg-black/60 text-white rounded-full border border-orange-400/40 shadow-lg backdrop-blur-md hover:-translate-y-1 transition-all duration-300 text-center">
              Donate Now
            </a>
          </motion.div>
        </motion.div>
      </article>


    </section>
  );
}
