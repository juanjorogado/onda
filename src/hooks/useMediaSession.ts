import { useEffect } from 'react';
import { TrackInfo } from '../types/track';

interface MediaSessionProps {
  track?: TrackInfo;
  stationName?: string;
  isPlaying: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onPreviousTrack?: () => void;
  onNextTrack?: () => void;
}

/**
 * Hook para configurar Media Session API
 * Permite controles en la pantalla de bloqueo y notificaciones de iOS/Android
 */
export function useMediaSession({
  track,
  stationName,
  isPlaying,
  onPlay,
  onPause,
  onPreviousTrack,
  onNextTrack,
}: MediaSessionProps) {
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const mediaSession = (navigator as any).mediaSession;

    // Configurar metadatos
    mediaSession.metadata = new (window as any).MediaMetadata({
      title: track?.title || stationName || 'ONDA Radio',
      artist: track?.artist || stationName || 'Radio en vivo',
      album: stationName || 'ONDA Radio',
      artwork: track?.cover
        ? [
            { src: track.cover, sizes: '512x512', type: 'image/png' },
            { src: track.cover, sizes: '192x192', type: 'image/png' },
          ]
        : [],
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
      } catch (err) {
        // Ignorar errores al limpiar
      }
    };
  }, [track, stationName, isPlaying, onPlay, onPause, onPreviousTrack, onNextTrack]);
}

