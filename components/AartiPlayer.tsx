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
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="aarti" aria-label="Aarti and Bhajans Audio Player">
      <audio ref={audioRef} />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <p className="text-orange-600 font-semibold tracking-wider uppercase mb-2 text-sm">Sacred Audio</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
            <Music2 className="text-amber-500" size={36} aria-hidden="true" /> Aarti & Bhajans
          </h2>
        </header>

        {/* Player Card */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-1 rounded-3xl shadow-2xl">
          <div className="bg-white rounded-[22px] p-8">
            {/* Now playing */}
            <AnimatePresence mode="wait">
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-5 mb-8"
              >
                {/* Album art */}
                <div className="relative flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg
                    ${playing ? "animate-spin" : ""}`}
                    style={{ animationDuration: "8s" }}>
                    <Music2 size={28} className="text-white" />
                  </div>
                  {playing && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-orange-400/30"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-gray-900 text-xl truncate">{track.title}</h3>
                  <p className="text-gray-400 text-sm mt-0.5 truncate">{track.subtitle || "Hanuman Mandir"}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="mb-4">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={seek}
                aria-label="Seek audio position"
                className="w-full h-2 rounded-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <button
                onClick={handlePrev}
                aria-label="Previous Track"
                className="w-11 h-11 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-600 transition-all hover:scale-110"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              <motion.button
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-amber-500 shadow-xl flex items-center justify-center text-white hover:shadow-orange-300 hover:scale-105 transition-all"
              >
                {playing
                  ? <Pause size={24} fill="currentColor" />
                  : <Play size={24} fill="currentColor" className="ml-1" />}
              </motion.button>

              <button
                onClick={handleNext}
                aria-label="Next Track"
                className="w-11 h-11 rounded-full bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-600 transition-all hover:scale-110"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Volume2 size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={changeVolume}
                aria-label="Volume Control"
                className="flex-1 h-1.5 rounded-full accent-orange-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Track list - scrollable */}
        <div className="mt-4 max-h-64 overflow-y-auto space-y-2 pr-1">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-3 px-1">Playlist</p>
          {tracks.map((t, i) => (
            <motion.button
              key={t.id}
              onClick={() => { setCurrent(i); setPlaying(true); setProgress(0); }}
              whileHover={{ x: 4 }}
              aria-label={`Play ${t.title}`}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl text-left transition-all
                ${i === current
                  ? "bg-orange-50 border border-orange-200"
                  : "hover:bg-gray-50 border border-transparent"}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0
                ${i === current ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {i === current && playing
                  ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                      <Music2 size={14} />
                    </motion.div>
                  : i + 1}
              </div>
              <div className="min-w-0">
                <p className={`font-semibold text-sm truncate ${i === current ? "text-orange-700" : "text-gray-800"}`}>{t.title}</p>
                {t.subtitle && <p className="text-xs text-gray-400 truncate">{t.subtitle}</p>}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
