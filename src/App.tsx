import { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { useWakeLock } from './hooks/useWakeLock';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useRadioPlayer } from './hooks/useRadioPlayer';
import { useMediaSession } from './hooks/useMediaSession';
import { Header } from './components/Header';
import { Clocks } from './components/Clocks';
import { CoverArt } from './components/CoverArt';
import { BRIGHTNESS_THRESHOLD } from './constants';

// Lazy load de componente no crítico
const NowPlaying = lazy(() => import('./components/NowPlaying').then(module => ({ default: module.NowPlaying })));

function App() {
  useWakeLock();
  const time = useCurrentTime();
  const [coverBrightness, setCoverBrightness] = useState<number>(0.5);

  const {
    currentStation,
    audioRef,
    isPlaying,
    togglePlay,
    nextStation,
    prevStation,
    handleAudioError,
    handleAudioEnded,
    headerName,
    headerLocation,
    coverArt,
    track,
  } = useRadioPlayer();

  // Memoizar callbacks para evitar re-renders innecesarios
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'left') nextStation();
    else if (direction === 'right') prevStation();
  }, [nextStation, prevStation]);

  const handleBrightnessChange = useCallback((brightness: number) => {
    setCoverBrightness(brightness);
  }, []);

  // Memoizar valores derivados
  const isBright = useMemo(() => coverBrightness > BRIGHTNESS_THRESHOLD, [coverBrightness]);
  const hasTrackInfo = useMemo(() => !!(track.title || track.artist), [track.title, track.artist]);
  const showNowPlaying = useMemo(() => !!(track.title || track.artist || headerName), [track.title, track.artist, headerName]);

  // Configurar Media Session API para controles en pantalla de bloqueo (iOS/Android)
  useMediaSession({
    track,
    stationName: headerName,
    isPlaying,
    onPlay: togglePlay,
    onPause: togglePlay,
    onPreviousTrack: prevStation,
    onNextTrack: nextStation,
  });

  return (
    <div className="min-h-screen bg-paper font-sans safe-area">
      <div
        className="bg-paper text-ink flex flex-col items-start select-none overflow-hidden w-full max-w-md mx-auto h-screen"
      >
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          preload="none"
          playsInline
          onError={handleAudioError}
          onEnded={handleAudioEnded}
        />
        <Header name={headerName} location={headerLocation} isPlaying={isPlaying} />

        <div className="flex-1 w-full flex flex-col items-start overflow-hidden min-h-0">
          {currentStation ? (
            <>
              <CoverArt
                cover={coverArt}
                stationCover={currentStation.cover}
                stationLocation={currentStation.location}
                stationTimezone={currentStation.timezone}
                hasTrackInfo={hasTrackInfo}
                isPlaying={isPlaying}
                onToggle={togglePlay}
                onSwipe={handleSwipe}
                onBrightnessChange={handleBrightnessChange}
                trackTitle={track.title}
                trackArtist={track.artist}
              >
                <Clocks
                  time={time}
                  location={currentStation.location}
                  timezone={currentStation.timezone}
                  isBright={isBright}
                />
              </CoverArt>
              {showNowPlaying && (
                <div className="w-full py-2">
                  <Suspense fallback={null}>
                    <NowPlaying title={track.title} artist={track.artist} year={track.year} stationName={headerName} />
                  </Suspense>
                </div>
              )}
            </>
          ) : (
            <div className="w-full flex-1 flex items-center justify-center">
              <div className="wave-container playing">
                <span className="wave-circle"></span>
                <span className="wave-circle"></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
