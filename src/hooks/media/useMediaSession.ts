import { useEffect, useMemo } from 'react';
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

// Colores canónicos (referencia a --color-black/#000000 y --color-white/#FFFFFF en src/styles/variables.css)
const COLOR_BLACK = '#000000';
const COLOR_WHITE = '#FFFFFF';

declare global {
  interface Window {
    MediaMetadata: new (init: MediaMetadataInit) => MediaMetadata;
  }
}

// Memoized gradient artwork generator
const gradientCache = new Map<string, string>();

function generateGradientArtwork(gradient: string, size: number): string | null {
  const cacheKey = `${gradient}-${size}`;
  if (gradientCache.has(cacheKey)) {
    return gradientCache.get(cacheKey)!;
  }
  
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
    const dataUrl = canvas.toDataURL('image/png');
    gradientCache.set(cacheKey, dataUrl);
    // Limit cache size
    if (gradientCache.size > 50) {
      const firstKey = gradientCache.keys().next().value;
      if (firstKey) gradientCache.delete(firstKey);
    }
    return dataUrl;
  } catch {
    return null;
  }
}

// Memoized station logo generator
const logoCache = new Map<string, string>();

function generateStationLogoArtwork(stationName: string, size: number): string | null {
  const cacheKey = `logo-${stationName}-${size}`;
  if (logoCache.has(cacheKey)) {
    return logoCache.get(cacheKey)!;
  }
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    ctx.fillStyle = isDarkMode ? COLOR_BLACK : COLOR_WHITE;
    ctx.fillRect(0, 0, size, size);

    const baseFontSize = size * 0.12;
    const maxWidth = size * 0.85;
    const words = stationName.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      ctx.font = `bold ${baseFontSize}px Arial, sans-serif`;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const maxLines = 4;
    let fontSize = baseFontSize;
    if (lines.length > maxLines) {
      fontSize = baseFontSize * (maxLines / lines.length);
    }

    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = isDarkMode ? COLOR_WHITE : COLOR_BLACK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = (size - totalHeight) / 2 + lineHeight / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, size / 2, startY + index * lineHeight);
    });

    const dataUrl = canvas.toDataURL('image/png');
    logoCache.set(cacheKey, dataUrl);
    if (logoCache.size > 50) {
      const firstKey = logoCache.keys().next().value;
      if (firstKey) logoCache.delete(firstKey);
    }
    return dataUrl;
  } catch {
    return null;
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
  // Memoize artwork to avoid regenerating on every render
  const artwork = useMemo(() => {
    const images: MediaImage[] = [];

    // 1. Track cover has highest priority
    if (track?.cover) {
      images.push(
        { src: track.cover, sizes: '512x512', type: 'image/png' },
        { src: track.cover, sizes: '192x192', type: 'image/png' }
      );
      return images;
    }

    // 2. Gradient artwork
    if (fallbackGradient) {
      const big = generateGradientArtwork(fallbackGradient, 512);
      const small = generateGradientArtwork(fallbackGradient, 192);
      if (big) images.push({ src: big, sizes: '512x512', type: 'image/png' });
      if (small) images.push({ src: small, sizes: '192x192', type: 'image/png' });
      if (images.length > 0) return images;
    }

    // 3. Station name logo as fallback
    if (stationName) {
      const logoBig = generateStationLogoArtwork(stationName, 512);
      const logoSmall = generateStationLogoArtwork(stationName, 192);
      if (logoBig) images.push({ src: logoBig, sizes: '512x512', type: 'image/png' });
      if (logoSmall) images.push({ src: logoSmall, sizes: '192x192', type: 'image/png' });
    }

    return images;
  }, [track?.cover, fallbackGradient, stationName]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const mediaSession = navigator.mediaSession;

    mediaSession.metadata = new window.MediaMetadata({
      title: track?.title || stationName || 'ONDA Radio',
      artist: track?.artist || stationName || 'Radio en vivo',
      album: stationName || 'ONDA Radio',
      artwork,
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
      try {
        mediaSession.setActionHandler('play', null);
        mediaSession.setActionHandler('pause', null);
        mediaSession.setActionHandler('previoustrack', null);
        mediaSession.setActionHandler('nexttrack', null);
      } catch {
        // Ignorar errores al limpiar
      }
    };
  }, [artwork, track?.title, track?.artist, stationName, isPlaying, onPlay, onPause, onPreviousTrack, onNextTrack]);
}
