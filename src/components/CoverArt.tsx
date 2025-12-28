import { memo, useRef, ReactNode, useState, KeyboardEvent, TouchEvent, useEffect, useCallback } from 'react';
import { getCityGradientFallback } from '../services/imageService';
import { SWIPE_THRESHOLD, GRADIENT_UPDATE_INTERVAL, BRIGHTNESS_VALUES, HOUR_RANGES } from '../constants';

interface CoverArtProps {
  cover: string;
  stationCover: string;
  stationLocation: string;
  stationTimezone?: string;
  hasTrackInfo: boolean;
  isPlaying: boolean;
  onToggle: () => void;
  onSwipe?: (direction: 'left' | 'right') => void;
  children?: ReactNode;
  onBrightnessChange?: (brightness: number) => void;
  trackTitle?: string;
  trackArtist?: string;
}

export const CoverArt = memo(({ cover, stationCover: _stationCover, stationLocation, stationTimezone, hasTrackInfo: _hasTrackInfo, isPlaying, onToggle, onSwipe, children, onBrightnessChange, trackTitle: _trackTitle, trackArtist: _trackArtist }: CoverArtProps) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const swiped = useRef(false);

  // Estado para el gradiente que se actualiza según la hora
  const [gradient, setGradient] = useState(() => getCityGradientFallback(stationLocation, stationTimezone));
  const [, setBrightness] = useState(0.4);

  // Memoizar el cálculo del brillo
  const calculateBrightness = useCallback((hour: number): number => {
    if (hour >= HOUR_RANGES.DAY_START && hour < HOUR_RANGES.DAY_END) return BRIGHTNESS_VALUES.DAY;
    if (hour >= HOUR_RANGES.DAWN_START && hour < HOUR_RANGES.DAWN_END) return BRIGHTNESS_VALUES.DAWN;
    if (hour >= HOUR_RANGES.DUSK_START && hour < HOUR_RANGES.DUSK_END) return BRIGHTNESS_VALUES.DUSK;
    return BRIGHTNESS_VALUES.NIGHT;
  }, []);

  // Actualizar gradiente según la hora del día (cada minuto)
  useEffect(() => {
    const updateGradient = () => {
      const newGradient = getCityGradientFallback(stationLocation, stationTimezone);
      setGradient(newGradient);
      
      // Calcular brillo basado en la hora del día
      const hour = stationTimezone 
        ? new Date().toLocaleString('en-US', { timeZone: stationTimezone, hour: 'numeric', hour12: false })
        : new Date().getHours();
      const hourNum = typeof hour === 'string' ? parseInt(hour, 10) : hour;
      
      const newBrightness = calculateBrightness(hourNum);
      setBrightness(newBrightness);
      onBrightnessChange?.(newBrightness);
    };

    // Actualizar inmediatamente
    updateGradient();

    // Actualizar cada minuto para cambios suaves
    const interval = setInterval(updateGradient, GRADIENT_UPDATE_INTERVAL);

    // Escuchar cambios en el dark mode
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = () => {
      updateGradient();
    };
    darkModeQuery.addEventListener('change', handleDarkModeChange);

    return () => {
      clearInterval(interval);
      darkModeQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, [stationLocation, stationTimezone, onBrightnessChange, calculateBrightness]);


  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? "Pause" : "Play"}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      onClick={onToggle}
      onTouchStart={(e: TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        startX.current = touch.clientX;
        startY.current = touch.clientY;
        swiped.current = false;
      }}
      onTouchMove={(e: TouchEvent<HTMLDivElement>) => {
        if (swiped.current || !onSwipe) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX.current;
        const dy = Math.abs(touch.clientY - startY.current);
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > dy) {
          swiped.current = true;
          onSwipe(dx > 0 ? 'right' : 'left');
        }
      }}
      onTouchEnd={(e: TouchEvent<HTMLDivElement>) => {
        if (swiped.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className="w-full rounded-card overflow-hidden relative cursor-pointer cover-height cover-art-container"
    >
      {/* Fondo con gradiente basado en la hora del día */}
      <div 
        className="absolute inset-0 cover-layer cover-base gradient-animated"
        style={{
          background: gradient,
        }}
      />
      {/* Cover del track si viene de los datos de la radio */}
      {cover && (
        <div 
          className="absolute inset-0 cover-layer cover-track"
          style={{
            backgroundImage: `url(${cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">
        {/* Relojes en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          {children}
        </div>
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className={`wave-container ${isPlaying ? 'playing' : ''}`}>
              <span className="wave-circle"></span>
              <span className="wave-circle"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

CoverArt.displayName = 'CoverArt';
