import { memo, KeyboardEvent, useRef, ReactNode, useMemo, useState, useEffect } from 'react';
import { useCurrentTime } from '../../hooks/time/useCurrentTime';
import { formatTime } from '../../utils/formatTime';
import { extractCity } from '../../utils/extractCity';
import { SWIPE_THRESHOLD, DEFAULT_GRADIENTS } from '../../constants';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { NowPlaying } from '../ui/NowPlaying';
import { getImageBrightness, getGradientBrightness } from '../../utils/getBrightness';

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
  isLoading?: boolean;
  hasError?: boolean;
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
  isLoading,
  hasError,
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
  const [translateY, setTranslateY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'horizontal' | 'vertical' | null>(null);
  const swipeDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(0);
  const containerHeight = useRef(0);
  const [isLight, setIsLight] = useState(false);

  // Hook de feedback háptico para mejor UX en coche
  const { play, pause, swipe } = useHapticFeedback();

  // Hora de la ciudad de la estación
  const stationTime = useMemo(() => formatTime(time, timezone), [time, timezone]);

  // Reset translate cuando cambia la estación
  useEffect(() => {
    setTranslateX(0);
    setTranslateY(0);
    setIsTransitioning(false);
    isDragging.current = false;
    setSwipeDirection(null);
    swipeDirectionRef.current = null;
  }, [stationName]);
  
  // Sincronizar ref con state
  useEffect(() => {
    swipeDirectionRef.current = swipeDirection;
  }, [swipeDirection]);

  // Actualizar el ancho y alto del contenedor
  useEffect(() => {
    const updateDimensions = () => {
      if (boardRef.current) {
        containerWidth.current = boardRef.current.offsetWidth || window.innerWidth;
        containerHeight.current = boardRef.current.offsetHeight || window.innerHeight;
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calcular el brillo del fondo para el contraste de texto
  useEffect(() => {
    let isMounted = true;
    let mediaQuery: MediaQueryList | null = null;
    
    const checkContrast = async () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isLandscape = window.innerWidth > window.innerHeight;
      
      // En landscape el fondo es dinámico (imagen o gradiente), en portrait es sólido
      if (isLandscape) {
        let brightness = prefersDark ? 0 : 255;
        
        if (coverImage) {
          try {
            brightness = await getImageBrightness(coverImage);
          } catch {
            if (coverGradient) {
              brightness = getGradientBrightness(coverGradient);
            }
          }
        } else if (coverGradient) {
          brightness = getGradientBrightness(coverGradient);
        }
        
        if (isMounted) {
          // Brillo > 128 = fondo claro → texto negro
          setIsLight(brightness > 128);
        }
      } else {
        // Portrait: usar modo del sistema (fondo sólido var(--color-paper))
        if (isMounted) {
          setIsLight(!prefersDark);
        }
      }
    };
    
    checkContrast();
    
    // Escuchar cambios en orientación
    mediaQuery = window.matchMedia('(orientation: landscape)');
    const handleOrientationChange = () => {
      checkContrast();
    };
    mediaQuery.addEventListener('change', handleOrientationChange);
    
    // Escuchar cambios en modo del sistema
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = () => {
      checkContrast();
    };
    darkModeQuery.addEventListener('change', handleDarkModeChange);
    
    return () => {
      isMounted = false;
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', handleOrientationChange);
      }
      darkModeQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, [coverImage, coverGradient]);

  // Formatear nombre de estación: "BBC 6 — London" (book para "BBC 6", light para "— London")
  const stationText = stationName;
  const city = extractCity(stationLocation);
  const locationText = city ? ` — ${city}` : '';

  // Event handlers con preventDefault usando listeners nativos (no pasivos)
  useEffect(() => {
    const element = boardRef.current;
    if (!element || !onSwipe) return;

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      swiped.current = false;
      isDragging.current = false;
      setIsTransitioning(false);
      setSwipeDirection(null);
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (swiped.current || !onSwipe) return;
      
      const touch = e.touches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      
      const currentDirection = swipeDirectionRef.current;
      
      // Determinar la dirección del swipe - solo horizontal
      if (!currentDirection && (absDx > 10 || absDy > 10)) {
        if (absDx > absDy * 1.2) {
          setSwipeDirection('horizontal');
          swipeDirectionRef.current = 'horizontal';
          e.preventDefault();
          e.stopPropagation();
        }
      }
      
      // Procesar swipe horizontal
      if (currentDirection === 'horizontal' && absDx > 10) {
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = true;
        
        const maxTranslate = containerWidth.current * 0.5;
        const clampedDx = Math.max(-maxTranslate, Math.min(maxTranslate, dx));
        setTranslateX(clampedDx);
        setTranslateY(0);
        
        if (absDx > SWIPE_THRESHOLD) {
          swiped.current = true;
          setIsTransitioning(true);

          // Feedback háptico al completar swipe
          swipe();

          const direction = dx > 0 ? 1 : -1;
          const finalTranslate = direction * containerWidth.current;
          setTranslateX(finalTranslate);

          setTimeout(() => {
            onSwipe(dx > 0 ? 'right' : 'left');
          }, 100);
        }
      }
      

    };

    const handleTouchEnd = (e: globalThis.TouchEvent) => {
      if (swiped.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      const currentDirection = swipeDirectionRef.current;
      const currentTranslateX = translateX;
      
      if (isDragging.current) {
        if (currentDirection === 'horizontal' && Math.abs(currentTranslateX) < SWIPE_THRESHOLD) {
          setIsTransitioning(true);
          setTranslateX(0);
          setTimeout(() => {
            setIsTransitioning(false);
            isDragging.current = false;
            setSwipeDirection(null);
          }, 300);
        } else {
          isDragging.current = false;
          setSwipeDirection(null);
        }
      }
    };

    // Agregar listeners con { passive: false } para permitir preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipe, swipe, translateX, translateY]);

  return (
    <div 
      className={`playing-screen-container ${swipeDirection === 'vertical' && isDragging.current ? 'swiping-vertical' : ''}`}
      data-brightness={isLight ? 'light' : 'dark'}
    >
      {/* Fondo desenfocado para todos los modos */}
      <div 
        className="playing-screen-landscape-bg"
        style={{
          background: coverImage ? `url(${coverImage}) center/cover no-repeat` : (coverGradient || DEFAULT_GRADIENTS.PLAYING),
          filter: 'blur(60px)',
          opacity: 0.9,
          position: 'fixed',
          inset: '-10%',
        }}
      />
      <div 
        ref={boardRef}
        className={`playing-screen-board ${isTransitioning ? 'swipe-transitioning' : ''} ${isDragging.current ? 'swipe-dragging' : ''}`}
        style={{
          transform: swipeDirection === 'vertical' 
            ? `translateY(${translateY}px)`
            : `translateX(${translateX}px) rotateY(${translateX * 0.05}deg)`,
          opacity: isDragging.current 
            ? swipeDirection === 'vertical' && containerHeight.current > 0
              ? Math.max(0.7, 1 - Math.abs(translateY) / (containerHeight.current * 0.5))
              : swipeDirection === 'horizontal' && containerWidth.current > 0
              ? Math.max(0.7, 1 - Math.abs(translateX) / (containerWidth.current * 0.5))
              : 1
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
              {locationText && <span className="playing-screen-station-name-light">{locationText}</span>}
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
              // Feedback háptico y sonoro según la acción
              if (isPlaying) {
                pause();
              } else {
                play();
              }
              onToggle();
            }
          }}
          onClick={() => {
            // Feedback háptico y sonoro según la acción
            if (isPlaying) {
              pause();
            } else {
              play();
            }
            onToggle();
          }}
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
                borderRadius: 'var(--radius-cover)',
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
            isPlaying={isPlaying}
          />
          
          {/* Loading/Error indicator */}
          {isLoading && (
            <div className="playing-screen-status" data-status="loading">
              Conectando...
            </div>
          )}
          {hasError && !isLoading && (
            <div className="playing-screen-status" data-status="error">
              Error de conexión
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PlayingScreen.displayName = 'PlayingScreen';
