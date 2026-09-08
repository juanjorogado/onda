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
    isOffline,
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

  // Pull-down para pasar de radio: avanza a la siguiente estación
  const handlePull = useCallback(() => {
    nextStation();
  }, [nextStation]);

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
    <>
      <div className="h-full font-sans">
      {/* Fondo a pantalla completa: cubre todo el viewport incl. carrier/home indicator.
          Color sólido blanco/negro según el tema del sistema (--color-background) */}
      <div className="app-fullscreen-bg" aria-hidden="true" />
      <main
        className="w-full select-none app-fullscreen-content"
      >
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          preload="none"
          playsInline
          onError={handleAudioError}
          onEnded={handleAudioEnded}
        />

        <div className="w-full h-full">
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
              statusText={isOffline ? 'Esperando a tener conexión' : undefined}
              streamUrl={currentStation?.url}
              onTrackIdentified={updateTrack}
              onToggle={togglePlay}
              onPull={handlePull}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <WaitingScreen />
            </div>
          )}
        </div>
      </main>
      </div>
    </>
  )
}

export default App
