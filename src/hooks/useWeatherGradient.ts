import { useState, useEffect } from 'react';
import { Station } from '../types/station';
import { getCityGradientFallback } from '../services/imageService';

export function useWeatherGradient(station: Station | null): { gradient: string } {
  const [gradient, setGradient] = useState(
    station ? getCityGradientFallback(station.location, station.timezone) : ''
  );

  useEffect(() => {
    if (!station) {
      setGradient('');
      return;
    }
    setGradient(getCityGradientFallback(station.location, station.timezone));
  }, [station]);

  return { gradient };
}
