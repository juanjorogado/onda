import { useEffect } from 'react';
import { TrackInfo } from '../../types/track';

interface MediaSessionProps {
  track?: TrackInfo;
  stationName?: string;
  fallbackGradient?: string;
  isPlaying: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onPreviousTrack?: () => void;
  onNextTrack?: () => void;
}

interface MediaImage {
  src: string;
  sizes?: string;
  type?: string;
}

interface MediaMetadataInit {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: MediaImage[];
}

declare global {
  interface Window {
    MediaMetadata: new (init: MediaMetadataInit) => MediaMetadata;
  }
}

/**
 * Hook para configurar Media Session API
 * Permite controles en la pantalla de bloqueo y notificaciones de iOS/Android
 */
export function useMediaSession({
  track,
  stationName,
  fallbackGradient,
  isPlaying,
  onPlay,
  onPause,
  onPreviousTrack,
  onNextTrack,
}: MediaSessionProps) {
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const mediaSession = navigator.mediaSession;

    const generateGradientArtwork = (gradient?: string, size = 512): string | null => {
      if (!gradient) return null;
      try {
        const angleMatch = gradient.match(/linear-gradient\(\s*([0-9]+)deg/i);
        const angle = angleMatch && angleMatch[1] ? parseFloat(angleMatch[1]) : 135;
        const colors = gradient.match(/hsl\([^)]+\)/gi) || ['hsl(220, 50%, 60%)', 'hsl(280, 50%, 40%)'];
        
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        
        const radians = (angle * Math.PI) / 180;
        const x = Math.cos(radians) * size;
        const y = Math.sin(radians) * size;
        const grad = ctx.createLinearGradient(0, 0, x, y);
        const n = colors.length;
        for (let i = 0; i < n; i++) {
          const stop = n === 1 ? 0 : i / (n - 1);
          grad.addColorStop(stop, colors[i]);
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        return canvas.toDataURL('image/png');
      } catch {
        return null;
      }
    };

    const fallbackArtwork = (!track?.cover && fallbackGradient)
      ? (() => {
          const big = generateGradientArtwork(fallbackGradient, 512);
          const small = generateGradientArtwork(fallbackGradient, 192);
          const artwork = [];
          if (big) artwork.push({ src: big, sizes: '512x512', type: 'image/png' });
          if (small) artwork.push({ src: small, sizes: '192x192', type: 'image/png' });
          return artwork;
        })()
      : [];

    // Configurar metadatos
    mediaSession.metadata = new window.MediaMetadata({
      title: track?.title || stationName || 'ONDA Radio',
      artist: track?.artist || stationName || 'Radio en vivo',
      album: stationName || 'ONDA Radio',
      artwork: track?.cover
        ? [
            { src: track.cover, sizes: '512x512', type: 'image/png' },
            { src: track.cover, sizes: '192x192', type: 'image/png' },
          ]
        : fallbackArtwork,
    });

    // Configurar acciones
    mediaSession.setActionHandler('play', () => {
      onPlay?.();
    });

    mediaSession.setActionHandler('pause', () => {
      onPause?.();
    });

    mediaSession.setActionHandler('previoustrack', () => {
      onPreviousTrack?.();
    });

    mediaSession.setActionHandler('nexttrack', () => {
      onNextTrack?.();
    });

    // Actualizar estado de reproducción
    mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

    return () => {
      // Limpiar handlers al desmontar
      try {
        mediaSession.setActionHandler('play', null);
        mediaSession.setActionHandler('pause', null);
        mediaSession.setActionHandler('previoustrack', null);
        mediaSession.setActionHandler('nexttrack', null);
      } catch {
        // Ignorar errores al limpiar
      }
    };
  }, [track, stationName, fallbackGradient, isPlaying, onPlay, onPause, onPreviousTrack, onNextTrack]);
}
