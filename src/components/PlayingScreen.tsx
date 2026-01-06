import { memo, KeyboardEvent, TouchEvent, useRef, ReactNode, useMemo } from 'react';
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
  
  // Hora de la ciudad de la estación
  const stationTime = useMemo(() => formatTime(time, timezone), [time, timezone]);

  // Formatear nombre de estación: "BBC 6 — London" (bold para "BBC 6", normal para "— London")
  const stationText = stationName;
  const locationText = stationLocation ? ` — ${stationLocation}` : '';

  return (
    <div className="playing-screen-container">
      <div className="playing-screen-board">
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
              <span className="playing-screen-station-name-bold">{stationText}</span>
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

