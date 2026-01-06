import { memo, KeyboardEvent, TouchEvent, useRef, ReactNode, useMemo, useState, useEffect } from 'react';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { formatTime } from '../utils/formatTime';
import { SWIPE_THRESHOLD, DEFAULT_GRADIENTS } from '../constants';
import { NowPlaying } from './NowPlaying';

interface PlayingScreenProps {
  stationName: string;
  stationLocation: string;
  trackTitle?: string;
  trackArtist?: string;
  trackAlbum?: string;
  trackYear?: number;
  coverGradient?: string;
  coverImage?: string;
  timezone?: string;
  isPlaying: boolean;
  onToggle: () => void;
  onSwipe?: (direction: 'left' | 'right') => void;
  children?: ReactNode;
}

export const PlayingScreen = memo(({ 
  stationName, 
  stationLocation, 
  trackTitle, 
  trackArtist, 
  trackAlbum,
  trackYear,
  coverGradient,
  coverImage,
  timezone,
  isPlaying,
  onToggle,
  onSwipe,
  children
}: PlayingScreenProps) => {
  const time = useCurrentTime();
  const startX = useRef(0);
  const startY = useRef(0);
  const swiped = useRef(false);
  const isDragging = useRef(false);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(0);
  
  // Hora de la ciudad de la estación
  const stationTime = useMemo(() => formatTime(time, timezone), [time, timezone]);

  // Reset translate cuando cambia la estación
  useEffect(() => {
    setTranslateX(0);
    setIsTransitioning(false);
    isDragging.current = false;
  }, [stationName]);

  // Actualizar el ancho del contenedor
  useEffect(() => {
    const updateWidth = () => {
      if (boardRef.current) {
        containerWidth.current = boardRef.current.offsetWidth || window.innerWidth;
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Formatear nombre de estación: "BBC 6 — London" (book para "BBC 6", normal para "— London")
  const stationText = stationName;
  const locationText = stationLocation ? ` — ${stationLocation}` : '';

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    swiped.current = false;
    isDragging.current = false;
    setIsTransitioning(false);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (swiped.current || !onSwipe) return;
    
    const touch = e.touches[0];
    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    // Solo procesar si el movimiento es principalmente horizontal
    if (absDx > 10 && absDx > absDy) {
      e.preventDefault();
      e.stopPropagation();
      isDragging.current = true;
      
      // Limitar el desplazamiento a la mitad del ancho del contenedor
      const maxTranslate = containerWidth.current * 0.5;
      const clampedDx = Math.max(-maxTranslate, Math.min(maxTranslate, dx));
      setTranslateX(clampedDx);
    }
    
    // Detectar swipe completo
    if (absDx > SWIPE_THRESHOLD && absDx > absDy) {
      swiped.current = true;
      setIsTransitioning(true);
      
      // Animar hasta el final
      const direction = dx > 0 ? 1 : -1;
      const finalTranslate = direction * containerWidth.current;
      setTranslateX(finalTranslate);
      
      // Llamar al callback después de un pequeño delay para permitir la animación
      setTimeout(() => {
        onSwipe(dx > 0 ? 'right' : 'left');
      }, 100);
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (swiped.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Si no se completó el swipe, volver a la posición original
    if (isDragging.current && Math.abs(translateX) < SWIPE_THRESHOLD) {
      setIsTransitioning(true);
      setTranslateX(0);
      setTimeout(() => {
        setIsTransitioning(false);
        isDragging.current = false;
      }, 300);
    } else {
      isDragging.current = false;
    }
  };

  return (
    <div 
      className="playing-screen-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        ref={boardRef}
        className={`playing-screen-board ${isTransitioning ? 'swipe-transitioning' : ''} ${isDragging.current ? 'swipe-dragging' : ''}`}
        style={{
          transform: `translateX(${translateX}px) rotateY(${translateX * 0.05}deg)`,
          opacity: isDragging.current && containerWidth.current > 0 
            ? Math.max(0.7, 1 - Math.abs(translateX) / (containerWidth.current * 0.5)) 
            : 1,
          transition: isTransitioning ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      >
        {/* Station Section */}
        <div className="playing-screen-station">
          {/* Onda Logo */}
          <div className="playing-screen-onda">
            {isPlaying ? (
              <div className={`wave-container playing`}>
                <span className="wave-circle"></span>
                <span className="wave-circle"></span>
              </div>
            ) : (
              <>

                <div className="playing-screen-ellipse-inner"></div>
              </>
            )}
          </div>
          
          {/* Board with Station Name and Time */}
          <div className="playing-screen-station-board">
            <div className="playing-screen-station-name">
              <span className="playing-screen-station-name-book">{stationText}</span>
              {locationText && <span className="playing-screen-station-name-normal">{locationText}</span>}
            </div>
            <div className="playing-screen-time">{stationTime}</div>
          </div>
        </div>

        {/* Cover - Clickable */}
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
          className="playing-screen-cover cursor-pointer"
          style={{
            background: coverGradient || DEFAULT_GRADIENTS.PLAYING,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Cover del álbum si está disponible */}
          {coverImage && (
            <div 
              className="playing-screen-cover-image"
              style={{
                backgroundImage: `url(${coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'var(--radius-22px)',
                zIndex: 1
              }}
              key={coverImage}
            />
          )}
          {children && (
            <div className="playing-screen-cover-content">
              {children}
            </div>
          )}
        </div>

        {/* Track Text - NowPlaying con marquee */}
        <div className="playing-screen-text-container">
          <NowPlaying 
            title={trackTitle}
            artist={trackArtist}
            album={trackAlbum}
            year={trackYear}
            stationName={stationName}
            fontSize="m"
          />
        </div>
      </div>
    </div>
  );
});

PlayingScreen.displayName = 'PlayingScreen';

