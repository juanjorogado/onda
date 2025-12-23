import { useWakeLock } from './hooks/useWakeLock';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useRadioPlayer } from './hooks/useRadioPlayer';
import { Header } from './components/Header';
import { Clocks } from './components/Clocks';
import { CoverArt } from './components/CoverArt';
import { NowPlaying } from './components/NowPlaying';

function App() {
  useWakeLock();
  const time = useCurrentTime();

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

  return (
    <div className="min-h-screen bg-paper font-sans safe-area">
      <div
        className="bg-paper text-ink flex flex-col items-start px-2 py-4 select-none overflow-hidden w-full max-w-md mx-auto h-screen"
      >
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          preload="none"
          onError={handleAudioError}
          onEnded={handleAudioEnded}
        />
        <Header name={headerName} location={headerLocation} isPlaying={isPlaying} />

        <div className="flex-1 w-full flex flex-col items-start overflow-hidden">
          {currentStation ? (
            <>
              <CoverArt
                cover={coverArt}
                stationCover={currentStation.cover}
                hasTrackInfo={!!(track.title || track.artist)}
                onToggle={togglePlay}
                onSwipe={(direction) => {
                  if (direction === 'left') nextStation();
                  else if (direction === 'right') prevStation();
                }}
              >
                <Clocks time={time} location={currentStation.location} timezone={currentStation.timezone} />
              </CoverArt>
              <div className="w-full mt-2">
                <NowPlaying title={track.title} artist={track.artist} />
              </div>
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
