/**
 * Constantes de la aplicación
 * Centralizadas para mejor mantenimiento
 */

// Intervalos de tiempo
export const POLLING_INTERVAL = 30000; // 30 segundos para polling de APIs
export const TIME_UPDATE_INTERVAL = 1000; // 1 segundo para actualización de reloj
export const GRADIENT_UPDATE_INTERVAL = 60000; // 1 minuto para actualización de gradiente

// Umbrales
export const SWIPE_THRESHOLD = 50; // Píxeles para detectar swipe
export const BRIGHTNESS_THRESHOLD = 0.5; // Umbral para cambiar color de texto

// Valores de brillo según hora del día
export const BRIGHTNESS_VALUES = {
  DAY: 0.6,        // 7-18h
  DAWN: 0.5,       // 5-7h
  DUSK: 0.45,      // 18-20h
  NIGHT: 0.3,      // 20-5h
  DEFAULT: 0.4,
} as const;

// Rangos de hora
export const HOUR_RANGES = {
  DAWN_START: 5,
  DAWN_END: 7,
  DAY_START: 7,
  DAY_END: 18,
  DUSK_START: 18,
  DUSK_END: 20,
} as const;

// URLs de APIs
export const API_ENDPOINTS = {
  KEXP: 'https://api.kexp.org/v2/plays/?ordering=-airdate&limit=1',
} as const;

// Configuración de audio
export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: 1.0,
  PRELOAD: 'none' as const,
} as const;

