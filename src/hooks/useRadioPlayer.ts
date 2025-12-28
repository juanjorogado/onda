import { useState, useEffect, useCallback, useMemo } from 'react';
import { stations } from '../data/stations';
import { useAudioPlayer } from './useAudioPlayer';
import { useNowPlaying } from './useNowPlaying';

export function useRadioPlayer() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (stations.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * stations.length));
    }
  }, []);

  // Memoizar la estación actual para evitar recálculos
  const currentStation = useMemo(() => stations[currentIndex] || null, [currentIndex]);

  const { audioRef, isPlaying, setIsPlaying, togglePlay } = useAudioPlayer({
    volume: 1.0,
    src: currentStation?.url,
  });

  const track = useNowPlaying(currentStation);

  const nextStation = useCallback(() => {
    if (stations.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % stations.length);
    setIsPlaying(true);
  }, [setIsPlaying]);

  const prevStation = useCallback(() => {
    if (stations.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + stations.length) % stations.length);
    setIsPlaying(true);
  }, [setIsPlaying]);

  const handleAudioError = useCallback(() => nextStation(), [nextStation]);
  const handleAudioEnded = useCallback(() => setIsPlaying(false), [setIsPlaying]);

  // Memoizar valores derivados
  const headerName = useMemo(() => currentStation?.name ?? 'ONDA', [currentStation?.name]);
  const headerLocation = useMemo(() => currentStation?.location ?? '', [currentStation?.location]);
  const coverArt = useMemo(() => track.cover || '', [track.cover]);

  return {
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
  };
}
