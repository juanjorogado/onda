import { useCallback } from 'react';
import { useWakeLock } from '../hooks/audio/useWakeLock';
import { useRadioPlayer } from '../hooks/audio/useRadioPlayer';
import { useMediaSession } from '../hooks/media/useMediaSession';
import { useWeatherGradient } from '../hooks/useWeatherGradient';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { DEFAULT_GRADIENTS } from '../constants';
import { WaitingScreen } from '../components/screens/WaitingScreen';
import { PlayingScreen } from '../components/screens/PlayingScreen';

function App() {
  useWakeLock();

  const {
    currentStation,
    audioRef,
    isPlaying,
    togglePlay,
    nextStation,
    prevStation,
    handleAudioError,
    handleAudioEnded,
    updateTrack,
    headerName,
    headerLocation,
    coverArt,
    track,
    hasError,
    isLoading,
  } = useRadioPlayer();

  // Keyboard navigation for station switching and play/pause
  useKeyboardNavigation({
    onNext: nextStation,
    onPrevious: prevStation,
    onToggle: togglePlay,
  });

  // Obtener gradiente (solo hora/ciudad, sin clima)
  const { gradient: weatherGradient } = useWeatherGradient(currentStation);

  const coverGradient = weatherGradient || DEFAULT_GRADIENTS.PLAYING;

  // Memoizar callbacks para evitar re-renders innecesarios
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'left') nextStation();
    else if (direction === 'right') prevStation();
  }, [nextStation, prevStation]);

  // Configurar Media Session API para controles en pantalla de bloqueo (iOS/Android)
  useMediaSession({
    track,
    stationName: headerName,
    fallbackGradient: coverGradient,
    isPlaying,
    onPlay: togglePlay,
    onPause: togglePlay,
    onPreviousTrack: prevStation,
    onNextTrack: nextStation,
  });

  

  return (
    <div className="min-h-screen bg-black font-sans safe-area">
      <div
        className="flex flex-col items-start select-none overflow-hidden w-full max-w-md mx-auto h-screen"
        style={{
          background: coverArt ? undefined : coverGradient,
          backgroundSize: '100% 100%',
        }}
      >
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          preload="none"
          playsInline
          onError={handleAudioError}
          onEnded={handleAudioEnded}
        />

        <div className="flex-1 w-full flex flex-col items-start overflow-hidden min-h-0">
          {currentStation ? (
            <PlayingScreen
              key={currentStation.id || currentStation.name}
              stationName={headerName}
              stationLocation={headerLocation}
              trackTitle={track.title}
              trackArtist={track.artist}
              trackAlbum={track.album}
              trackYear={track.year}
              coverGradient={weatherGradient}
              coverImage={coverArt}
              timezone={currentStation.timezone}
              isPlaying={isPlaying}
              isLoading={isLoading}
              hasError={hasError}
              streamUrl={currentStation?.url}
              onTrackIdentified={updateTrack}
              onToggle={togglePlay}
              onSwipe={handleSwipe}
            >
            </PlayingScreen>
          ) : (
            <div className="w-full flex-1 flex items-center justify-center">
              <WaitingScreen />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
