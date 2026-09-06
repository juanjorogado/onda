import { memo, KeyboardEvent, useRef, useMemo, useState, useEffect } from 'react';
import { TrackInfo } from '../../types/track';
import { useCurrentTime } from '../../hooks/time/useCurrentTime';
import { formatTime } from '../../utils/formatTime';
import { extractCity } from '../../utils/extractCity';
import { PULL_THRESHOLD, PULL_RESISTANCE, PULL_MAX_TRANSLATE, DEFAULT_GRADIENTS } from '../../constants';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { NowPlaying } from '../ui/NowPlaying';
import { ShazamButton } from '../ui/ShazamButton';
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
  statusText?: string;
  streamUrl?: string;
  onTrackIdentified?: (track: TrackInfo) => Promise<TrackInfo>;
  onToggle: () => void;
  onPull: () => void;
  /** @deprecated usar onPull */
  onSwipe?: (direction: 'left' | 'right') => void;
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
  statusText,
  streamUrl,
  onTrackIdentified,
  onToggle,
  onPull,
  onSwipe,
}: PlayingScreenProps) => {
  const time = useCurrentTime();
  const startX = useRef(0);
  const startY = useRef(0);
  const hasCompletedPull = useRef(false);
  const isDragging = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pullDirection, setPullDirection] = useState<'vertical' | null>(null);
  const pullDirectionRef = useRef<'vertical' | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLight, setIsLight] = useState(false);

  // Cross-fade: blurred background
  const bgSource = coverImage
    ? `url(${coverImage}) center/cover no-repeat`
    : (coverGradient || DEFAULT_GRADIENTS.PLAYING);
  const bgSourceRef = useRef(bgSource);
  const [displayedBg, setDisplayedBg] = useState(bgSource);
  const [fadingOutBg, setFadingOutBg] = useState<string | null>(null);
  const [isBgEntering, setIsBgEntering] = useState(false);
  const bgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (bgSource === bgSourceRef.current) return;
    setFadingOutBg(bgSourceRef.current);
    bgSourceRef.current = bgSource;
    setDisplayedBg(bgSource);
    setIsBgEntering(true);
    if (bgTimerRef.current) clearTimeout(bgTimerRef.current);
    bgTimerRef.current = setTimeout(() => {
      setFadingOutBg(null);
      setIsBgEntering(false);
    }, 1000);
  }, [bgSource]);

  // Cross-fade: portada del álbum
  const coverImageRef = useRef(coverImage);
  const [displayedCoverImage, setDisplayedCoverImage] = useState<string | undefined>(coverImage);
  const [fadingOutCoverImage, setFadingOutCoverImage] = useState<string | undefined>(undefined);
  const coverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (coverImage === coverImageRef.current) return;
    if (coverImageRef.current) setFadingOutCoverImage(coverImageRef.current);
    coverImageRef.current = coverImage;
    setDisplayedCoverImage(coverImage);
    if (coverTimerRef.current) clearTimeout(coverTimerRef.current);
    coverTimerRef.current = setTimeout(() => setFadingOutCoverImage(undefined), 1000);
  }, [coverImage]);

  useEffect(() => {
    return () => {
      if (bgTimerRef.current) clearTimeout(bgTimerRef.current);
      if (coverTimerRef.current) clearTimeout(coverTimerRef.current);
    };
  }, []);

  // Hook de feedback háptico para mejor UX en coche
  const { play, pause, swipe } = useHapticFeedback();

  // Hora de la ciudad de la estación
  const stationTime = useMemo(() => formatTime(time, timezone), [time, timezone]);

  // Reset translate cuando cambia la estación
  useEffect(() => {
    setTranslateY(0);
    setIsTransitioning(false);
    isDragging.current = false;
    setIsDraggingState(false);
    setPullDirection(null);
    pullDirectionRef.current = null;
  }, [stationName]);
  
  // Sincronizar ref con state
  useEffect(() => {
    pullDirectionRef.current = pullDirection;
  }, [pullDirection]);

  // Calcular el brillo del fondo para el contraste de texto
  useEffect(() => {
    let isMounted = true;
    let mediaQuery: MediaQueryList | null = null;
    
    const checkContrast = async () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // El fondo siempre es la imagen o gradiente desenfocado — detectar brillo real.
      // Sin imagen ni gradiente, se usa la preferencia del sistema como fallback.
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
        setIsLight(brightness > 128);
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
  const locationText = city ?? '';

  // Event handlers con preventDefault usando listeners nativos (no pasivos)
  const triggerPull = useRef<(() => void) | null>(null);
  triggerPull.current = onPull ?? (onSwipe ? () => onSwipe('left') : undefined as unknown as () => void);

  useEffect(() => {
    const element = boardRef.current;
    const container = containerRef.current;
    if (!element) return;
    const pullTrigger = triggerPull.current;
    if (!pullTrigger) return;

    const isAtTop = () => {
      if (container) return container.scrollTop <= 2;
      // fallback: board parent scrollable
      return true;
    };

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      hasCompletedPull.current = false;
      isDragging.current = false;
      setIsDraggingState(false);
      setIsTransitioning(false);
      setPullDirection(null);
      pullDirectionRef.current = null;
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (hasCompletedPull.current) {
        // ya disparado, bloquear scroll residual
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      const touch = e.touches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      
      const currentDirection = pullDirectionRef.current;

      // Determinar dirección: solo vertical pull-down
      if (!currentDirection && (absDx > 8 || absDy > 8)) {
        // Si el gesto es claramente vertical y hacia abajo, reclamarlo
        if (absDy > absDx * 1.15 && dy > 0) {
          // Solo reclamar si estamos arriba del todo — evita robar scroll interno
          if (!isAtTop()) {
            // Dejar que el navegador haga scroll normal
            return;
          }
          setPullDirection('vertical');
          pullDirectionRef.current = 'vertical';
          // Reclamamos el gesto: evita scroll / pull-to-refresh nativo
          e.preventDefault();
          e.stopPropagation();
        } else if (absDx > absDy * 1.2 || dy < 0) {
          // Gesto horizontal o pull-up: no es nuestro caso, dejar pasar (no reclamar)
          return;
        }
      }
      
      // Procesar pull-down vertical
      if (pullDirectionRef.current === 'vertical') {
        // Solo dy positivo (hacia abajo); dy negativo es scroll up y lo ignoramos
        if (dy <= 0) return;

        // Si durante el arrastre dejamos de estar arriba, cancelar
        if (!isAtTop() && !isDragging.current) return;

        e.preventDefault();
        e.stopPropagation();
        isDragging.current = true;
        setIsDraggingState(true);

        // Resistencia progresiva: más allá del umbral cuesta más avanzar
        const raw = dy * PULL_RESISTANCE;
        let damped: number;
        if (raw <= PULL_THRESHOLD) {
          damped = raw;
        } else {
          const extra = raw - PULL_THRESHOLD;
          // curva de resistencia: 0.3 de factor extra hasta el máximo
          damped = PULL_THRESHOLD + Math.min(extra * 0.32, PULL_MAX_TRANSLATE - PULL_THRESHOLD);
        }
        const clamped = Math.min(damped, PULL_MAX_TRANSLATE);
        setTranslateY(clamped);
        
        if (clamped >= PULL_THRESHOLD && !hasCompletedPull.current) {
          hasCompletedPull.current = true;
          setIsTransitioning(true);

          // Feedback háptico al completar pull
          swipe();

          // Animar al máximo y disparar cambio de estación
          setTranslateY(PULL_MAX_TRANSLATE + 20);

          setTimeout(() => {
            pullTrigger();
          }, 110);
        }
      }
    };

    const handleTouchEnd = (e: globalThis.TouchEvent) => {
      if (hasCompletedPull.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      const currentDirection = pullDirectionRef.current;
      
      if (isDragging.current) {
        // Si no se alcanzó el umbral, volver con rebote
        if (currentDirection === 'vertical' && translateY < PULL_THRESHOLD) {
          setIsTransitioning(true);
          setTranslateY(0);
          setTimeout(() => {
            setIsTransitioning(false);
            isDragging.current = false;
            setIsDraggingState(false);
            setPullDirection(null);
            pullDirectionRef.current = null;
          }, 280);
        } else {
          // Limpiar estado sin animar (ya se animó al completar)
          isDragging.current = false;
          setIsDraggingState(false);
          setPullDirection(null);
          pullDirectionRef.current = null;
        }
      } else {
        // Toco corto sin arrastre
        setPullDirection(null);
        pullDirectionRef.current = null;
      }
    };

    const handleTouchCancel = () => {
      if (hasCompletedPull.current) return;
      setIsTransitioning(true);
      setTranslateY(0);
      setTimeout(() => {
        setIsTransitioning(false);
        isDragging.current = false;
        setIsDraggingState(false);
        setPullDirection(null);
        pullDirectionRef.current = null;
        hasCompletedPull.current = false;
      }, 280);
    };

    // Agregar listeners con { passive: false } para permitir preventDefault
    // touchstart puede ser passive, pero move/end deben ser no-passive
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [swipe, translateY]);

  const pullProgress = Math.min(translateY / PULL_THRESHOLD, 1);
  const pullOpacity = isDraggingState ? Math.max(0.55, 1 - pullProgress * 0.35) : 1;

  return (
    <div
      ref={containerRef}
      className="playing-screen-container"
      data-brightness={isLight ? 'light' : 'dark'}
    >
      {/* Fondo desenfocado — cross-fade entre fuente anterior y nueva */}
      {fadingOutBg && (
        <div
          className="playing-screen-landscape-bg playing-screen-landscape-bg--out"
          style={{ background: fadingOutBg }}
          aria-hidden="true"
        />
      )}
      <div
        key={displayedBg}
        className={`playing-screen-landscape-bg${isBgEntering ? ' playing-screen-landscape-bg--in' : ''}`}
        style={{ background: displayedBg }}
        aria-hidden="true"
      />
      {/* Indicador sutil de pull — solo visible al arrastrar */}
      {isDraggingState && translateY > 8 && (
        <div
          className="playing-screen-pull-indicator"
          aria-hidden="true"
          style={{
            opacity: Math.min(0.9, pullProgress * 0.9),
            transform: `translateY(${Math.min(translateY * 0.15, 12)}px) scale(${0.9 + pullProgress * 0.1})`,
          }}
        >
          <span className={`playing-screen-pull-dot ${pullProgress >= 1 ? 'is-ready' : ''}`} />
        </div>
      )}

      <div 
        ref={boardRef}
        className={`playing-screen-board ${isTransitioning ? 'swipe-transitioning pull-transitioning' : ''} ${isDraggingState ? 'swipe-dragging pull-dragging' : ''}`}
        style={{
          transform: `translateY(${translateY}px)`,
          opacity: pullOpacity,
          transition: isTransitioning ? 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.28s cubic-bezier(0.32, 0.72, 0, 1)' : 'none',
        }}
      >
        {/* Station Section */}
        <div className="playing-screen-station">
          {/* Onda Logo */}
          <div className="playing-screen-onda">
            {isPlaying && !statusText ? (
              <div className={`wave-container playing`}>
                <span className="wave-circle"></span>
                <span className="wave-circle"></span>
              </div>
            ) : (
              <div className="playing-screen-ellipse-inner"></div>
            )}
          </div>
          
          {/* Board with Station Name and Time */}
          <div className="playing-screen-station-board">
            <div className="playing-screen-station-name">
              <span className="playing-screen-station-name-book">{stationText}</span>
              {locationText && <span className="playing-screen-station-name-light"> — {locationText}</span>}
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
          {/* Cover del álbum — cross-fade entre imagen anterior y nueva */}
          {fadingOutCoverImage && (
            <div
              className="playing-screen-cover-image playing-screen-cover-image--out"
              style={{
                backgroundImage: `url(${fadingOutCoverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: 'var(--radius-cover)',
                zIndex: 1,
              }}
              aria-hidden="true"
            />
          )}
          {displayedCoverImage && (
            <div
              key={displayedCoverImage}
              className="playing-screen-cover-image"
              style={{
                backgroundImage: `url(${displayedCoverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: 'var(--radius-cover)',
                zIndex: 2,
              }}
            />
          )}

          {isPlaying && !trackTitle && !trackArtist && streamUrl && (
            <ShazamButton
              streamUrl={streamUrl}
              stationName={stationName}
              onTrackIdentified={onTrackIdentified}
            />
          )}
        </div>

        {/* Track Text - NowPlaying con marquee */}
        <div className="playing-screen-text-container">
          <div aria-live="polite" aria-atomic="true">
            <NowPlaying
              title={trackTitle}
              artist={trackArtist}
              album={trackAlbum}
              year={trackYear}
              stationName={stationName}
              isPlaying={isPlaying}
              statusText={statusText}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

PlayingScreen.displayName = 'PlayingScreen';
