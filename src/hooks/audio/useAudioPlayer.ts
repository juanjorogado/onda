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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && src) {
      setIsLoading(true);
      setError(null);
      
      if (audioRef.current.src !== src) {
        audioRef.current.src = src;
        audioRef.current.load();
        if (isPlaying) {
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
      } else {
        setIsLoading(false);
      }
    }
  }, [src, isPlaying]);

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
        audio.play().catch(() => {});
      }
    };

    const handlePageShow = () => {
      if (isPlaying && audio.paused) {
        audio.play().catch(() => {});
      }
    };

    const handlePageHide = () => {};

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
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
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
        .catch((err) => {
          console.error('Audio play error:', err);
          setError('No se pudo reproducir el audio');
          setIsPlaying(false);
        });
    }
  };

  return { audioRef, isPlaying, setIsPlaying, togglePlay, isLoading, error, setError };
}
