import { useState, useEffect, useCallback } from 'react';
import { Station } from '../types/station';
import { getStationWeather, weatherToGradientParams } from '../services/weatherService';
import { getCityGradientFallback, getWeatherInfluencedGradient } from '../services/imageService';

interface WeatherGradientState {
  gradient: string;
  weatherDescription: string | null;
  weatherType: 'sunny' | 'cloudy' | 'rainy' | 'foggy' | 'stormy' | 'snowy' | null;
  weatherIntensity: number; // 0-1
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
    weatherDescription: null,
    weatherType: null,
    weatherIntensity: 0.5,
    isLoading: false,
  });

  const updateGradient = useCallback(async () => {
    if (!station) {
      setState({ gradient: '', weatherDescription: null, weatherType: null, weatherIntensity: 0.5, isLoading: false });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Intentar obtener clima real
      const weather = await getStationWeather(station);

      if (weather) {
        // Generar gradiente con influencia del clima
        const params = weatherToGradientParams(weather);
        const gradient = getWeatherInfluencedGradient(
          station.location,
          station.timezone,
          params
        );

        setState({
          gradient,
          weatherDescription: `${weather.description} (${weather.type})`,
          weatherType: weather.type,
          weatherIntensity: weather.intensity,
          isLoading: false,
        });
      } else {
        // Fallback: usar gradiente basado solo en hora
        const gradient = getCityGradientFallback(station.location, station.timezone);
        setState({
          gradient,
          weatherDescription: null,
          weatherType: null,
          weatherIntensity: 0.5,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('[useWeatherGradient] Error:', error);
      // Fallback en caso de error
      const gradient = getCityGradientFallback(station.location, station.timezone);
      setState({
        gradient,
        weatherDescription: null,
        weatherType: null,
        weatherIntensity: 0.5,
        isLoading: false,
      });
    }
  }, [station]);

  useEffect(() => {
    // Actualizar inmediatamente al cambiar de estación
    updateGradient();

    // Actualizar cada 30 minutos para reflejar cambios climáticos
    const interval = setInterval(updateGradient, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [updateGradient]);

  return state;
}
