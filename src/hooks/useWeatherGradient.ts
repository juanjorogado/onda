import { useState, useEffect, useCallback } from 'react';
import { Station } from '../types/station';
import { getCityGradientFallback } from '../services/imageService';

interface WeatherGradientState {
  gradient: string;
  isLoading: boolean;
}

/**
 * Hook para obtener gradientes influenciados por el clima real
 * @param station - Estación actual
 * @returns Estado del gradiente con información del clima
 */
export function useWeatherGradient(station: Station | null): WeatherGradientState {
  const [state, setState] = useState<WeatherGradientState>({
    gradient: station ? getCityGradientFallback(station.location, station.timezone) : '',
    isLoading: false,
  });

  const updateGradient = useCallback(async () => {
    if (!station) {
      setState({ gradient: '', isLoading: false });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const gradient = getCityGradientFallback(station.location, station.timezone);
      setState({
        gradient,
        isLoading: false,
      });
    } catch (error) {
      console.error('[useWeatherGradient] Error:', error);
      setState({
        gradient: getCityGradientFallback(station.location, station.timezone),
        isLoading: false,
      });
    }
  }, [station]);

  useEffect(() => {
    // Actualizar inmediatamente al cambiar de estación
    updateGradient();

    return () => void 0;
  }, [updateGradient]);

  return state;
}
