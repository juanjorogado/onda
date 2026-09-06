import { useCallback, useEffect } from 'react';
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

  

  // Fondo continuo en standalone: el gradiente/cover debe llegar bajo el status bar (carrier)
  // y home indicator. Sincronizamos html/body con el gradiente activo para que
  // el área de safe-insets (status bar + home) no corte con #000/#FFF.
  const appBackground = !currentStation
    ? '#fff'
    : coverArt
      ? '#000'
      : coverGradient;

  useEffect(() => {
    // Resolver fondo continuo: extraer color sólido del gradiente para html/body (evita corte por transparencia)
    let bg = appBackground;
    if (!currentStation) {
      const paper = getComputedStyle(document.documentElement).getPropertyValue('--color-paper').trim();
      if (paper) bg = paper;
    }
    const solid = bg.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,6}/)?.[0] || bg;
    // html/body con color sólido asegura continuidad en safe-area top/bottom (status bar + home indicator)
    document.documentElement.style.background = solid;
    document.documentElement.style.backgroundColor = solid;
    document.body.style.background = solid;
    document.body.style.backgroundColor = solid;
    // theme-color para Safari/PWA
    let metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = solid;
    return () => {};
  }, [appBackground, currentStation]);

  return (
    <div
      className="min-h-screen bg-black font-sans"
      style={{
        background: appBackground,
        // Asegura que html/body y wrapper compartan el mismo fondo para el overscroll
      }}
    >
      <main
        className="flex flex-col items-start select-none overflow-hidden w-full max-w-md mx-auto h-screen min-h-[100dvh] min-h-[-webkit-fill-available]"
        style={{
          background: coverArt ? undefined : coverGradient,
          backgroundSize: '100% 100%',
          // Extender fondo bajo el notch sin añadir padding extra aquí
          minHeight: '100dvh',
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
              statusText={isOffline ? 'Esperando a tener conexión' : undefined}
              streamUrl={currentStation?.url}
              onTrackIdentified={updateTrack}
              onToggle={togglePlay}
              onPull={handlePull}
            />
          ) : (
            <div className="w-full flex-1 flex items-center justify-center">
              <WaitingScreen />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
