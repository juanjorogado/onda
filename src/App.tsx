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
        className="bg-paper text-ink flex flex-col items-start p-4 gap-2 select-none overflow-hidden w-screen h-screen"
      >
        <audio 
          ref={audioRef} 
          onError={handleAudioError}
          onEnded={handleAudioEnded}
        />
        <Header name={headerName} location={headerLocation} isPlaying={isPlaying} />

        <div className="flex-1 w-full flex flex-col items-start gap-6 pt-4">
          {currentStation ? (
            <>
              <Clocks time={time} location={currentStation.location} timezone={currentStation.timezone} />
              <CoverArt 
                cover={coverArt} 
                isPlaying={isPlaying} 
                onToggle={togglePlay}
                onSwipe={nextStation}
              />
              <NowPlaying title={track.title} artist={track.artist} />
            </>
          ) : (
            <div className="text-ink font-light animate-pulse">Loading...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
