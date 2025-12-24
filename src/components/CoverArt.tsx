import { useRef, ReactNode, useEffect, useState } from 'react';
import { useImageBrightness } from '../hooks/useImageBrightness';
import { getCitySkyImageUnsplash, getCitySkyImageGemini } from '../services/imageService';

interface Flame {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface CoverArtProps {
  cover: string;
  stationCover: string;
  stationLocation: string;
  hasTrackInfo: boolean;
  isPlaying: boolean;
  onToggle: () => void;
  onSwipe?: (direction: 'left' | 'right') => void;
  children?: ReactNode;
  onBrightnessChange?: (brightness: number) => void;
}

const SWIPE_THRESHOLD = 50;

export function CoverArt({ cover, stationCover, stationLocation, hasTrackInfo, isPlaying, onToggle, onSwipe, children, onBrightnessChange }: CoverArtProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const swiped = useRef(false);

  const [displayCover, setDisplayCover] = useState<string>(
    cover || stationCover || getCitySkyImageUnsplash(stationLocation)
  );

  useEffect(() => {
    if (cover) {
      setDisplayCover(cover);
    } else if (stationCover) {
      setDisplayCover(stationCover);
    } else {
      getCitySkyImageGemini(stationLocation)
        .then(setDisplayCover)
        .catch(() => setDisplayCover(getCitySkyImageUnsplash(stationLocation)));
    }
  }, [cover, stationCover, stationLocation]);
  
  const brightness = useImageBrightness(displayCover || null);
  const [flames, setFlames] = useState<Flame[]>([]);
  
  useEffect(() => {
    onBrightnessChange?.(brightness);
  }, [brightness, onBrightnessChange]);

  const handleFlameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const container = target.closest('.cover-art-container') as HTMLElement;
    
    if (!container) return;
    
    const rect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top + rect.height / 2;
    
    const baseId = Date.now();
    const newFlames: Flame[] = Array.from({ length: 8 }, (_, i) => ({
      id: baseId + i,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      delay: Math.random() * 0.2,
    }));
    
    setFlames((prev) => [...prev, ...newFlames]);
    
    setTimeout(() => {
      setFlames((prev) => prev.filter((f) => !newFlames.some((nf) => nf.id === f.id)));
    }, 2000);
  };

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
      className="w-full rounded-card overflow-hidden relative bg-cover bg-center bg-no-repeat cursor-pointer cover-height cover-art-container"
      style={{
        backgroundImage: displayCover 
          ? `url(${displayCover}), linear-gradient(to bottom, var(--color-gray-100), var(--color-gray-200))`
          : `linear-gradient(to bottom, var(--color-gray-100), var(--color-gray-200))`,
      }}
    >
      {children}
      {hasTrackInfo && (
        <div 
          className="absolute left-3 bottom-3 text-2xl flame-icon cursor-pointer z-10"
          onClick={handleFlameClick}
        >
          🔥
        </div>
      )}
      {flames.map((flame) => (
        <div
          key={flame.id}
          className="flame-particle"
          style={{
            left: `${flame.x}px`,
            top: `${flame.y}px`,
            animationDelay: `${flame.delay}s`,
          }}
        >
          🔥
        </div>
      ))}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="ripple-container">
            <span className={`ripple-circle ${brightness > 0.5 ? 'ripple-dark' : 'ripple-light'}`}></span>
            <span className={`ripple-circle ${brightness > 0.5 ? 'ripple-dark' : 'ripple-light'}`}></span>
            <span className={`ripple-circle ${brightness > 0.5 ? 'ripple-dark' : 'ripple-light'}`}></span>
          </div>
        </div>
      )}
    </div>
  );
}
