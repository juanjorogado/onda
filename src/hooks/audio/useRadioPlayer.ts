import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { stations } from '../../data/stations';
import { useAudioPlayer } from './useAudioPlayer';
import { useNowPlaying } from '../media/useNowPlaying';
import { useHapticFeedback } from '../useHapticFeedback';
import { useOnlineStatus } from '../useOnlineStatus';

export function useRadioPlayer() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [, setHasError] = useState<boolean>(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOnline = useOnlineStatus();
  const prevOnlineRef = useRef(isOnline);

  // Hook de feedback háptico para mejor UX en coche
  const { stationChange } = useHapticFeedback();

  useEffect(() => {
    if (stations.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * stations.length));
    }
  }, []);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Memoizar la estación actual para evitar recálculos
  const currentStation = useMemo(() => stations[currentIndex] || null, [currentIndex]);

  const { audioRef, isPlaying, setIsPlaying, togglePlay } = useAudioPlayer({
    volume: 1.0,
    src: currentStation?.url,
  });

  const { updateTrack, ...track } = useNowPlaying(currentStation);

  const changeStation = useCallback((newIndex: number) => {
    if (stations.length <= 1) return;

    // Permitir cambios encadenados (cada pull-down cambia de emisora, suene o no)
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    stationChange();
    setCurrentIndex(newIndex);
    setIsPlaying(true);
  }, [setIsPlaying, stationChange]);

  const nextStation = useCallback(() => {
    const newIndex = (currentIndex + 1) % stations.length;
    changeStation(newIndex);
  }, [currentIndex, changeStation]);

  const prevStation = useCallback(() => {
    const newIndex = (currentIndex - 1 + stations.length) % stations.length;
    changeStation(newIndex);
  }, [currentIndex, changeStation]);

  const nextStationRef = useRef(nextStation);
  useEffect(() => { nextStationRef.current = nextStation; });

  const handleAudioError = useCallback(() => {
    setHasError(true);
    if (isOnline) {
      setTimeout(() => {
        setHasError(false);
        nextStationRef.current();
      }, 2000);
    }
  }, [isOnline]);

  // Al recuperar la conexión, saltar a la siguiente estación
  useEffect(() => {
    if (isOnline && !prevOnlineRef.current) {
      setHasError(false);
      nextStationRef.current();
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline]);

  const handleAudioEnded = useCallback(() => setIsPlaying(false), [setIsPlaying]);

  // Memoizar valores derivados
  const headerName = useMemo(() => currentStation?.name ?? 'ONDA', [currentStation?.name]);
  // El location debe ser siempre el de la estación cargada actualmente
  const headerLocation = useMemo(() => currentStation?.location ?? '', [currentStation]);
  const coverArt = useMemo(() => track.cover || '', [track.cover]);

  return {
    currentStation,
    audioRef,
    isPlaying,
    isOffline: !isOnline,
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
  };
}
