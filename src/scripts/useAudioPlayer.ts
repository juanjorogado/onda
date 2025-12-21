import { useEffect, useRef, useState } from 'react';

interface Options {
  volume?: number;
  src?: string;
}

export function useAudioPlayer({ volume = 1.0, src }: Options) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && src) {
      if (audioRef.current.src !== src) {
        audioRef.current.src = src;
        if (isPlaying) {
          audioRef.current.play().catch(() => {
            setIsPlaying(false);
          });
        }
      }
    }
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  };

  return { audioRef, isPlaying, setIsPlaying, togglePlay };
}
