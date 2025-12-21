import { useState, useEffect, useCallback } from 'react';
import { stations, Station } from '../data/stations';
import { useAudioPlayer } from './useAudioPlayer';
import { useNowPlaying } from './useNowPlaying';

export function useRadioPlayer() {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  
  const { audioRef, isPlaying, setIsPlaying, togglePlay } = useAudioPlayer({
    volume: 1.0,
    src: currentStation?.url,
  });
  
  const track = useNowPlaying(currentStation);

  // Inicialización: seleccionar estación aleatoria al montar
  useEffect(() => {
    if (stations.length > 0) {
      const randomStation = stations[Math.floor(Math.random() * stations.length)];
      setCurrentStation(randomStation);
    }
  }, []);

  // Función para cambiar a la siguiente estación
  const nextStation = useCallback(() => {
    if (!currentStation || stations.length <= 1) return;
    
    const availableStations = stations.filter(s => s.id !== currentStation.id);
    const randomIndex = Math.floor(Math.random() * availableStations.length);
    setCurrentStation(availableStations[randomIndex]);
    setIsPlaying(true);
  }, [currentStation, setIsPlaying]);

  const handleAudioError = useCallback(() => setIsPlaying(false), [setIsPlaying]);
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
    handleAudioError,
    handleAudioEnded,
    headerName,
    headerLocation,
    coverArt,
    track,
  };
}
