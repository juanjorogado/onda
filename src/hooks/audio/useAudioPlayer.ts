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
        console.log('App visible y debería estar sonando. Intentando reanudar...');
        audio.play().catch(() => {});
      }
    };

    const handlePageShow = () => {
      if (isPlaying && audio.paused) {
        console.log('PageShow detectado y debería estar sonando. Intentando reanudar...');
        audio.play().catch(() => {});
      }
    };

    const handlePause = () => {
      // Si el audio se pausa pero el estado isPlaying es true, fue una interrupción del sistema
      if (isPlaying) {
        console.log('Audio pausado por el sistema (interrupción)');
      }
    };

    const handlePlay = () => {
    };

    const handleFocus = () => {
      if (isPlaying && audio.paused) {
        console.log('Foco recuperado y debería estar sonando. Intentando reanudar...');
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
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', handleFocus);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
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
