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
  }, [src, isPlaying, setIsPlaying]);

  // Prevenir que iOS pause el audio cuando la app va a segundo plano
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Configurar audio para continuar en segundo plano (iOS)
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    audio.setAttribute('x-webkit-airplay', 'allow');
    
    // Prevenir que iOS pause automáticamente
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isPlaying && audio.paused) {
        // Si el audio se pausó cuando la página se ocultó, intentar reanudar
        audio.play().catch(() => {
          // Ignorar errores de autoplay
        });
      }
    };

    const handlePageShow = () => {
      // Reanudar audio cuando la página vuelve a ser visible
      if (isPlaying && audio.paused) {
        audio.play().catch(() => {});
      }
    };

    const handlePageHide = () => {
      // Mantener el audio reproduciéndose cuando la página se oculta
      if (isPlaying && !audio.paused) {
        // No hacer nada, dejar que continúe
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return { audioRef, isPlaying, setIsPlaying, togglePlay };
}
