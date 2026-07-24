"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Track = { id: number; title: string; subtitle?: string; audioUrl: string };

function formatTime(s: number) {
  if (isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AartiPlayer({ tracks }: { tracks: Track[] }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = tracks[current];

  // Sync audio src when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.audioUrl;
    audio.volume = volume;
    if (playing) audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => handleNext();
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().catch(() => {}); setPlaying(true); }
  };

  const handleNext = useCallback(() => {
    setCurrent(c => (c + 1) % tracks.length);
    setPlaying(true);
    setProgress(0);
  }, [tracks.length]);

  const handlePrev = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; return; }
    setCurrent(c => (c - 1 + tracks.length) % tracks.length);
    setPlaying(true);
    setProgress(0);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setProgress(val);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-[100vw] overflow-x-hidden sm:overflow-visible w-full" id="aarti" aria-label="Aarti and Bhajans Audio Player">
      <audio ref={audioRef} />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-2 sm:mb-10">
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Music2 className="text-amber-500" size={36} aria-hidden="true" /> Aarti & Bhajans
          </h2>
        </header>

        {/* Player Card */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-1 rounded-3xl shadow-2xl">
          <div className="bg-white rounded-[22px] p-4 sm:p-6">
            
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Now playing */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  {/* Album art */}
                  <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-md
                    ${playing ? "animate-spin" : ""}`}
                    style={{ animationDuration: "8s" }}>
                    <Music2 size={20} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{track.title}</h3>
                    <p className="text-gray-400 text-[11px] sm:text-xs truncate">{track.subtitle || "Hanuman Mandir"}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                <button onClick={handlePrev} aria-label="Previous Track" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-600 transition-all">
                  <SkipBack size={14} fill="currentColor" />
                </button>
                <motion.button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} whileTap={{ scale: 0.9 }} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-600 to-amber-500 shadow-lg flex items-center justify-center text-white transition-all">
                  {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                </motion.button>
                <button onClick={handleNext} aria-label="Next Track" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-600 transition-all">
                  <SkipForward size={14} fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-gray-400 w-8 text-right font-medium">{formatTime(progress)}</span>
              <input type="range" min={0} max={duration || 100} value={progress} onChange={seek} className="flex-1 h-1.5 rounded-full accent-orange-600 cursor-pointer" />
              <span className="text-[10px] sm:text-xs text-gray-400 w-8 font-medium">{formatTime(duration)}</span>
            </div>

          </div>
        </div>

        {/* Track list - grid (row-wise) */}
        <div className="mt-4 sm:mt-6">
          <div className="flex sm:grid sm:grid-cols-2 gap-2 sm:gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-64 pb-2 snap-x" style={{ scrollbarWidth: 'none' }}>
            {tracks.map((t, i) => (
              <motion.button
                key={t.id}
                onClick={() => { setCurrent(i); setPlaying(true); setProgress(0); }}
                whileHover={{ scale: 1.02 }}
                aria-label={`Play ${t.title}`}
                className={`w-[75vw] sm:w-full flex-shrink-0 snap-center flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-2xl text-left transition-all
                  ${i === current
                    ? "bg-orange-50 border border-orange-200"
                    : "bg-white hover:bg-gray-50 border border-gray-100"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0
                  ${i === current ? "bg-orange-600 text-white shadow-md" : "bg-gray-100 text-gray-500"}`}>
                  {i === current && playing
                    ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                        <Music2 size={16} />
                      </motion.div>
                    : i + 1}
                </div>
                <div className="min-w-0">
                  <p className={`font-semibold text-sm truncate ${i === current ? "text-orange-700" : "text-gray-800"}`}>{t.title}</p>
                  {t.subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{t.subtitle}</p>}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
