import { useState, useCallback, useEffect } from 'react';
import { stations } from '../data/stations';
import { useAudioPlayer } from './useAudioPlayer';
import { useNowPlaying } from './useNowPlaying';

export function useRadioPlayer() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentStation = stations[currentIndex] || null;

  const { audioRef, isPlaying, setIsPlaying, togglePlay } = useAudioPlayer({
    volume: 1.0,
    src: currentStation?.url,
  });

  const track = useNowPlaying(currentStation);

  // Auto-play on mount
  useEffect(() => {
    if (currentStation && !isPlaying) {
      setIsPlaying(true);
    }
  }, [currentStation, isPlaying, setIsPlaying]);

  // Función para cambiar a la siguiente estación
  const nextStation = useCallback(() => {
    if (stations.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % stations.length);
    setIsPlaying(true);
  }, [setIsPlaying]);

  // Función para cambiar a la estación anterior
  const prevStation = useCallback(() => {
    if (stations.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + stations.length) % stations.length);
    setIsPlaying(true);
  }, [setIsPlaying]);

  const handleAudioError = useCallback(() => {
    // On error, try the next station
    nextStation();
  }, [nextStation]);

  const handleAudioEnded = useCallback(() => setIsPlaying(false), [setIsPlaying]);

  const headerName = currentStation?.name ?? 'ONDA';
  const headerLocation = currentStation?.location ?? '';
  const coverArt = track.cover || currentStation?.cover || '';

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
