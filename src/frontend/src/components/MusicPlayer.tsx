import { Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { HeroPhoto, MusicTrack } from "../hooks/useQueries";
import { useGetMusicTrack } from "../hooks/useQueries";

export type { HeroPhoto, MusicTrack };

export default function MusicPlayer() {
  const { data: track } = useGetMusicTrack();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Attempt autoplay when track loads
  useEffect(() => {
    if (!track?.dataUrl || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = track.dataUrl;
    audio.loop = true;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setNeedsInteraction(false);
      } catch {
        // Autoplay blocked — require user interaction
        setNeedsInteraction(true);
        setIsPlaying(false);
      }
    };

    tryPlay();

    return () => {
      audio.pause();
    };
  }, [track?.dataUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setNeedsInteraction(false);
      } catch {
        setNeedsInteraction(true);
      }
    }
  };

  if (!track || dismissed) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 animate-player-slide-in"
      data-ocid="music.panel"
    >
      <div
        className="relative flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.30 0.080 10 / 0.92) 0%, oklch(0.22 0.055 12 / 0.95) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid oklch(0.52 0.105 10 / 0.5)",
          boxShadow:
            "0 8px 32px oklch(0.22 0.055 12 / 0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
          minWidth: "220px",
          maxWidth: "280px",
        }}
      >
        {/* Audio element */}
        {/* biome-ignore lint/a11y/useMediaCaption: music player with dataUrl track */}
        <audio ref={audioRef} loop />

        {/* Animated music icon */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(0.52 0.105 10 / 0.3)",
            border: "1px solid oklch(0.52 0.105 10 / 0.5)",
          }}
        >
          <span
            className={isPlaying ? "animate-heartbeat" : ""}
            style={{ fontSize: "1rem" }}
          >
            ♪
          </span>
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          {needsInteraction ? (
            <p className="font-lato text-white/70 text-xs tracking-wide">
              Tap to play
            </p>
          ) : (
            <p
              className="font-dancing text-white truncate"
              style={{ fontSize: "0.95rem" }}
            >
              {track.title}
            </p>
          )}
          <p className="font-lato text-white/40 text-xs mt-0.5">
            {isPlaying ? "Now playing" : "Paused"}
          </p>
        </div>

        {/* Play/Pause button */}
        <button
          type="button"
          onClick={togglePlay}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: "oklch(0.52 0.105 10)",
            boxShadow: "0 2px 8px oklch(0.52 0.105 10 / 0.4)",
          }}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          data-ocid="music.toggle"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-white" />
          ) : (
            <Play className="w-3.5 h-3.5 text-white" />
          )}
        </button>

        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            audioRef.current?.pause();
            setIsPlaying(false);
            setDismissed(true);
          }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: "oklch(0.35 0.095 10)",
            border: "1px solid oklch(0.52 0.105 10 / 0.5)",
          }}
          aria-label="Close music player"
          data-ocid="music.close_button"
        >
          <X className="w-2.5 h-2.5 text-white" />
        </button>
      </div>
    </div>
  );
}
