import { useState, useEffect } from 'react';
import { stations, Station } from './stations';
import { useWakeLock } from './scripts/useWakeLock';
import { useNow } from './scripts/useNow';
import { useAudioPlayer } from './scripts/useAudioPlayer';
import { Header } from './components/Header';
import { Clocks } from './components/Clocks';
import { CoverArt } from './components/CoverArt';
import { NowPlaying } from './components/NowPlaying';
import { useNowPlaying } from './scripts/useNowPlaying';

function App() {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  useWakeLock();
  const time = useNow();
  const { audioRef, isPlaying, setIsPlaying, togglePlay } = useAudioPlayer({
    volume: 1.0,
    src: currentStation?.url,
  });
  const track = useNowPlaying(currentStation);
  
  const nextStation = () => {
    if (!stations.length) return;
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * stations.length);
    } while (stations[nextIndex].id === currentStation?.id && stations.length > 1);
    setCurrentStation(stations[nextIndex]);
    setIsPlaying(true);
  };

  useEffect(() => {
    const randomStation = stations[Math.floor(Math.random() * stations.length)];
    setCurrentStation(randomStation);
  }, []);

  const headerName = currentStation?.name ?? 'ONDA';
  const headerLocation = currentStation?.location ?? '';

  return (
    <div className="min-h-screen bg-paper font-sans safe-area">
      <div 
        className="bg-paper text-ink flex flex-col items-start p-4 gap-2 select-none overflow-hidden w-screen h-screen"
      >
        <audio 
          ref={audioRef} 
          onError={() => {
              setIsPlaying(false);
          }}
          onEnded={() => setIsPlaying(false)}
        />
        <Header name={headerName} location={headerLocation} />

        <div className="flex-1 w-full flex flex-col justify-start items-start gap-6 pt-4">
          {currentStation ? (
            <>
              <Clocks time={time} location={currentStation.location} timezone={currentStation.timezone} />
              
              <div className="space-y-2 w-full mt-8">
                <div className="h-1 w-12 bg-brand"></div>
              </div>

              <CoverArt 
                cover={track.cover || currentStation.cover} 
                isPlaying={isPlaying} 
                onToggle={togglePlay}
                onSwipe={() => nextStation()}
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
