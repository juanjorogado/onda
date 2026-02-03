import { useCallback } from 'react';
import { useWakeLock } from '../hooks/audio/useWakeLock';
import { useRadioPlayer } from '../hooks/audio/useRadioPlayer';
import { useMediaSession } from '../hooks/media/useMediaSession';
import { useWeatherGradient } from '../hooks/useWeatherGradient';
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
    headerName,
    headerLocation,
    coverArt,
    track,
  } = useRadioPlayer();

  // Obtener gradiente influenciado por el clima real
  const { gradient: weatherGradient } = useWeatherGradient(currentStation);

  // Memoizar callbacks para evitar re-renders innecesarios
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'left') nextStation();
    else if (direction === 'right') prevStation();
  }, [nextStation, prevStation]);

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
