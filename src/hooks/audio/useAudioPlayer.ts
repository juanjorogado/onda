import { useEffect, useRef, useState } from 'react';
import { AUDIO_CONFIG } from '../../constants';

interface Options {
  volume?: number;
  src?: string;
}

export function useAudioPlayer({ volume = AUDIO_CONFIG.DEFAULT_VOLUME, src }: Options) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPlayingRef = useRef(isPlaying);

  // Mantener ref sincronizada sin añadirla a los deps del efecto de src
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !src) return;
    if (audioRef.current.src === src) return;

    setIsLoading(true);
    setError(null);
    audioRef.current.src = src;
    audioRef.current.load();

    if (isPlayingRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Audio play error:', err);
          setIsPlaying(false);
          setIsLoading(false);
          setError('No se pudo reproducir el audio');
        });
    }
  }, [src]);

  // Prevenir que iOS pause el audio cuando la app va a segundo plano e interrupciones (llamadas)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Configurar audio para continuar en segundo plano (iOS)
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    audio.setAttribute('x-webkit-airplay', 'allow');
    
    // Prevenir que iOS pause automáticamente o intentar reanudar
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlaying && audio.paused) {
        audio.play().catch(() => {});
      }
    };

    const handlePageShow = () => {
      if (isPlaying && audio.paused) {
        audio.play().catch(() => {});
      }
    };

    const handleFocus = () => {
      if (isPlaying && audio.paused) {
        audio.play().catch(() => {});
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setError('Error de conexión con la estación');
      setIsPlaying(false);
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', handleFocus);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handleFocus);
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
        .catch((err) => {
          console.error('Audio play error:', err);
          setError('No se pudo reproducir el audio');
          setIsPlaying(false);
        });
    }
  };

  return { audioRef, isPlaying, setIsPlaying, togglePlay, isLoading, error, setError };
}
