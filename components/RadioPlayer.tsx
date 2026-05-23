'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Radio, ChevronUp, ChevronDown } from 'lucide-react';

const STREAM_URL = process.env.NEXT_PUBLIC_RADIO_STREAM_URL || 'https://stream.zeno.fm/0r0xa792kwzuv';
const METADATA_URL = process.env.NEXT_PUBLIC_RADIO_METADATA_URL || '';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [nowPlaying, setNowPlaying] = useState('Radio El Renuevo');
  const [artist, setArtist] = useState('En vivo 24/7');
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!METADATA_URL) return;
    const fetchMeta = async () => {
      try {
        const res = await fetch(METADATA_URL);
        const data = await res.json();
        if (data?.now_playing?.song?.title) setNowPlaying(data.now_playing.song.title);
        if (data?.now_playing?.song?.artist) setArtist(data.now_playing.song.artist);
      } catch {
        // silently fail
      }
    };
    fetchMeta();
    const interval = setInterval(fetchMeta, 15000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audio.src = STREAM_URL;
      audio.load();
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <audio ref={audioRef} preload="none" />

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[hsl(220,32%,10%)]/98 backdrop-blur-md border-t border-[hsl(43,96%,56%)]/20 px-4 py-4">
              <div className="max-w-2xl mx-auto flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-[hsl(220,15%,52%)] text-xs uppercase tracking-widest mb-2 block">
                    Volumen
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolume}
                    className="w-full accent-[hsl(43,96%,56%)] h-1 rounded-full cursor-pointer"
                  />
                </div>
                <div className="text-right text-xs text-[hsl(220,15%,52%)]">
                  <p>AzuraCast</p>
                  <p className="text-gold">En línea</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bar */}
      <div className="bg-[hsl(220,35%,6%)]/98 backdrop-blur-md border-t border-[hsl(43,96%,56%)]/25 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Live badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-[hsl(220,15%,40%)]'}`} />
            <Radio className="w-4 h-4 text-gold" />
          </div>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity shadow-md shadow-yellow-600/20 disabled:opacity-60"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[hsl(220,35%,6%)] border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 text-[hsl(220,35%,6%)] fill-current" />
            ) : (
              <Play className="w-4 h-4 text-[hsl(220,35%,6%)] fill-current ml-0.5" />
            )}
          </button>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{nowPlaying}</p>
            <p className="text-[hsl(220,15%,52%)] text-xs truncate">{artist}</p>
          </div>

          {/* Volume toggle */}
          <button
            onClick={toggleMute}
            className="text-[hsl(45,70%,80%)] hover:text-gold transition-colors p-1 flex-shrink-0"
            aria-label="Silenciar"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[hsl(220,15%,52%)] hover:text-gold transition-colors p-1 flex-shrink-0"
            aria-label="Expandir controles"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
