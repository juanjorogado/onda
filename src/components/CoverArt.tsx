import { useRef, ReactNode, useEffect } from 'react';
import { useImageBrightness } from '../hooks/useImageBrightness';
import { getCitySkyImageUnsplash } from '../utils/getCitySkyImage';

interface CoverArtProps {
  cover: string;
  stationCover: string;
  stationLocation: string;
  hasTrackInfo: boolean;
  onToggle: () => void;
  onSwipe?: (direction: 'left' | 'right') => void;
  children?: ReactNode;
  onBrightnessChange?: (brightness: number) => void;
}

const SWIPE_THRESHOLD = 50;

export function CoverArt({ cover, stationCover, stationLocation, hasTrackInfo, onToggle, onSwipe, children, onBrightnessChange }: CoverArtProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const swiped = useRef(false);

  // Usar cover del track si existe, si no el cover de la estación, si no imagen del cielo de la ciudad
  const displayCover = cover || stationCover || getCitySkyImageUnsplash(stationLocation);
  
  // Calcular brillo de la imagen
  const brightness = useImageBrightness(displayCover || null);
  
  // Notificar cambio de brillo al componente padre
  useEffect(() => {
    if (onBrightnessChange) {
      onBrightnessChange(brightness);
    }
  }, [brightness, onBrightnessChange]);

  return (
    <div
      onClick={onToggle}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        startX.current = touch.clientX;
        startY.current = touch.clientY;
        swiped.current = false;
      }}
      onTouchMove={(e) => {
        if (swiped.current || !onSwipe) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX.current;
        const dy = Math.abs(touch.clientY - startY.current);
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > dy) {
          swiped.current = true;
          onSwipe(dx > 0 ? 'right' : 'left');
        }
      }}
      onTouchEnd={(e) => {
        if (swiped.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className="w-full rounded-card overflow-hidden relative bg-cover bg-center bg-no-repeat cursor-pointer cover-height"
      style={{
        backgroundImage: displayCover 
          ? `url(${displayCover}), linear-gradient(to bottom, var(--color-gray-100), var(--color-gray-200))`
          : `linear-gradient(to bottom, var(--color-gray-100), var(--color-gray-200))`,
      }}
    >
      {children}
      {hasTrackInfo && (
        <div className="absolute left-3 bottom-3 text-2xl flame-icon">🔥</div>
      )}
    </div>
  );
}
