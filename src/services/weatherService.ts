import { Station } from '../types/station';

// Coordenadas de las ciudades de las estaciones
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Tokyo, Japan': { lat: 35.6762, lon: 139.6503 },
  'Kyoto, Japan': { lat: 35.0116, lon: 135.7681 },
  'London, UK': { lat: 51.5074, lon: -0.1278 },
  'Jersey City, USA': { lat: 40.7282, lon: -74.0776 },
  'Los Angeles, USA': { lat: 34.0522, lon: -118.2437 },
  'Seattle, USA': { lat: 47.6062, lon: -122.3321 },
  'Paris, France': { lat: 48.8566, lon: 2.3522 },
  'Milan, Italy': { lat: 45.4642, lon: 9.19 },
  'Berlin, Germany': { lat: 52.52, lon: 13.405 },
  'California, USA': { lat: 36.7783, lon: -119.4179 },
  'Oregon, USA': { lat: 44.9429, lon: -123.0351 },
};

// Mapeo de códigos WMO a condiciones simplificadas
interface WeatherCondition {
  type: 'sunny' | 'cloudy' | 'rainy' | 'foggy' | 'stormy' | 'snowy';
  description: string;
  intensity: number; // 0-1
}

// Códigos WMO de Open-Meteo: https://open-meteo.com/en/docs
const WMO_WEATHER_CODES: Record<number, { type: WeatherCondition['type']; desc: string }> = {
  0: { type: 'sunny', desc: 'Clear sky' },
  1: { type: 'sunny', desc: 'Mainly clear' },
  2: { type: 'cloudy', desc: 'Partly cloudy' },
  3: { type: 'cloudy', desc: 'Overcast' },
  45: { type: 'foggy', desc: 'Foggy' },
  48: { type: 'foggy', desc: 'Depositing rime fog' },
  51: { type: 'rainy', desc: 'Light drizzle' },
  53: { type: 'rainy', desc: 'Moderate drizzle' },
  55: { type: 'rainy', desc: 'Dense drizzle' },
  56: { type: 'rainy', desc: 'Light freezing drizzle' },
  57: { type: 'rainy', desc: 'Dense freezing drizzle' },
  61: { type: 'rainy', desc: 'Slight rain' },
  63: { type: 'rainy', desc: 'Moderate rain' },
  65: { type: 'rainy', desc: 'Heavy rain' },
  66: { type: 'rainy', desc: 'Light freezing rain' },
  67: { type: 'rainy', desc: 'Heavy freezing rain' },
  71: { type: 'snowy', desc: 'Slight snow fall' },
  73: { type: 'snowy', desc: 'Moderate snow fall' },
  75: { type: 'snowy', desc: 'Heavy snow fall' },
  77: { type: 'snowy', desc: 'Snow grains' },
  80: { type: 'rainy', desc: 'Slight rain showers' },
  81: { type: 'rainy', desc: 'Moderate rain showers' },
  82: { type: 'rainy', desc: 'Violent rain showers' },
  85: { type: 'snowy', desc: 'Slight snow showers' },
  86: { type: 'snowy', desc: 'Heavy snow showers' },
  95: { type: 'stormy', desc: 'Thunderstorm' },
  96: { type: 'stormy', desc: 'Thunderstorm with slight hail' },
  99: { type: 'stormy', desc: 'Thunderstorm with heavy hail' },
};

// Respuesta de Open-Meteo
interface OpenMeteoResponse {
  current_weather?: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number; // 1 = día, 0 = noche
    time: string;
  };
  error?: boolean;
  reason?: string;
}

// Cache para evitar llamadas excesivas (30 minutos)
const weatherCache = new Map<string, { condition: WeatherCondition; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

/**
 * Obtiene el clima actual de una ciudad usando Open-Meteo (API gratuita, sin key)
 * @param location - Nombre de la ciudad (ej: 'Paris, France')
 * @returns Condición meteorológica actual o null si hay error
 */
export async function getCurrentWeather(location: string): Promise<WeatherCondition | null> {
  // Verificar cache
  const cached = weatherCache.get(location);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.condition;
  }

  const coords = CITY_COORDINATES[location];
  if (!coords) {
    console.warn(`[WeatherService] No coordinates found for: ${location}`);
    return null;
  }

  try {
    // Open-Meteo API - 100% gratuita, no requiere API key
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
    
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: OpenMeteoResponse = await response.json();

    if (data.error || !data.current_weather) {
      throw new Error(data.reason || 'No weather data');
    }

    const weatherCode = data.current_weather.weathercode;
    const isDay = data.current_weather.is_day === 1;
    const temp = data.current_weather.temperature;

    // Determinar condición base
    const condition = WMO_WEATHER_CODES[weatherCode] || { type: 'cloudy', desc: 'Unknown' };
    
    // Ajustes basados en día/noche y temperatura
    let type = condition.type;
    let intensity = 0.5;

    // Si es de noche y estaba soleado, cambiar a despejado nocturno
    if (!isDay && type === 'sunny') {
      type = 'cloudy'; // Cielo despejado nocturno (menos saturado)
      intensity = 0.3;
    }

    // Ajustar intensidad según temperatura
    if (temp > 25) intensity = Math.min(1, intensity + 0.2); // Más intenso si hace calor
    if (temp < 5) intensity = Math.max(0.2, intensity - 0.2); // Menos intenso si hace frío

    const weatherCondition: WeatherCondition = {
      type,
      description: condition.desc,
      intensity,
    };

    // Guardar en cache
    weatherCache.set(location, {
      condition: weatherCondition,
      timestamp: Date.now(),
    });

    console.log(`[WeatherService] ${location}: ${weatherCondition.description} (${weatherCondition.type}, intensity: ${weatherCondition.intensity})`);
    
    return weatherCondition;

  } catch (error) {
    console.error(`[WeatherService] Error fetching weather for ${location}:`, error);
    return null;
  }
}

/**
 * Convierte la condición climática a parámetros de gradiente
 * @param condition - Condición meteorológica
 * @returns Parámetros para generar el gradiente
 */
export function weatherToGradientParams(condition: WeatherCondition): {
  saturation: number;
  lightness: number;
  warmth: number;
  blueShift: number;
} {
  const baseParams: Record<WeatherCondition['type'], { saturation: number; lightness: number; warmth: number; blueShift: number }> = {
    sunny: { saturation: 1.2, lightness: 1.1, warmth: 15, blueShift: 0 },
    cloudy: { saturation: 0.8, lightness: 0.9, warmth: -5, blueShift: 0 },
    rainy: { saturation: 0.7, lightness: 0.8, warmth: -15, blueShift: 20 },
    foggy: { saturation: 0.6, lightness: 1.0, warmth: -10, blueShift: 5 },
    stormy: { saturation: 1.3, lightness: 0.7, warmth: -20, blueShift: 10 },
    snowy: { saturation: 0.5, lightness: 1.3, warmth: -25, blueShift: 15 },
  };

  const base = baseParams[condition.type];
  
  // Ajustar según intensidad
  return {
    saturation: 0.5 + (base.saturation - 0.5) * condition.intensity,
    lightness: 0.7 + (base.lightness - 0.7) * condition.intensity,
    warmth: base.warmth * condition.intensity,
    blueShift: base.blueShift * condition.intensity,
  };
}

/**
 * Obtiene el clima actual de una estación
 * @param station - Objeto estación
 * @returns Condición meteorológica o null
 */
export async function getStationWeather(station: Station): Promise<WeatherCondition | null> {
  return getCurrentWeather(station.location);
}
