/**
 * Constantes de la aplicación
 * Centralizadas para mejor mantenimiento
 */

// Intervalos de tiempo
export const POLLING_INTERVAL = 30000; // 30 segundos para polling de APIs
export const TIME_UPDATE_INTERVAL = 1000; // 1 segundo para actualización de reloj
export const TRANSITION_DURATION = 300; // ms — coincide con --duration-fast (0.3s)

// Umbrales
export const SWIPE_THRESHOLD = 50; // Píxeles para detectar swipe (legacy horizontal, mantener por compatibilidad)
export const PULL_THRESHOLD = 80; // Píxeles para detectar pull-down para cambio de estación
export const PULL_RESISTANCE = 0.55; // Factor de resistencia al arrastrar (0-1, menor = más resistencia)
export const PULL_MAX_TRANSLATE = 140; // Máximo desplazamiento visual en px durante pull

// Timeout para providers de now playing (ms)
export const PROVIDER_TIMEOUT = 8000;
export const SHOUTCAST_TIMEOUT = 5000;

// URLs de APIs
export const API_ENDPOINTS = {
  KEXP: 'https://api.kexp.org/v2/plays/?ordering=-airdate&limit=1',
} as const;

// Configuración de audio
export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: 1.0,
} as const;

// Gradientes por defecto (deben coincidir con --gradient-* en src/styles/variables.css)
export const DEFAULT_GRADIENTS = {
  PLAYING: 'linear-gradient(to bottom, rgba(74, 96, 162, 1) 0%, rgba(74, 96, 162, 0) 100%)',
  WAITING: 'linear-gradient(to bottom, rgba(182, 214, 194, 1) 0%, rgba(74, 96, 162, 0) 100%)',
} as const;

// ============================================
// Feedback Háptico - Optimizado para uso en coche
// ============================================

// Patrones de vibración (en milisegundos)
// Formato: número único o array [vibrate, pause, vibrate, ...]
export const HAPTIC_PATTERNS = {
  /** Feedback ligero para toques simples (10ms) */
  TAP: 10,
  /** Confirmación de éxito: vibrate-pause-vibrate */
  SUCCESS: [50, 100, 50],
  /** Error: vibrate-pause-vibrate (más largo) */
  ERROR: [100, 50, 100],
  /** Cambio de estación: vibrate-pause-vibrate (corto) */
  STATION_CHANGE: [30, 50, 30],
  /** Advertencia suave */
  WARNING: [50, 50, 50],
} as const;

// Configuración de sonidos para Web Audio API
// Frecuencias en Hz, duraciones en ms
export const SOUND_CONFIG = {
  /** Play: tono ascendente (200Hz -> 400Hz, 100ms) */
  PLAY: {
    frequencyStart: 200,
    frequencyEnd: 400,
    duration: 100,
    type: 'sine' as OscillatorType,
    volume: 0.3,
  },
  /** Pause: tono descendente (400Hz -> 200Hz, 100ms) */
  PAUSE: {
    frequencyStart: 400,
    frequencyEnd: 200,
    duration: 100,
    type: 'sine' as OscillatorType,
    volume: 0.3,
  },
  /** Station change: beep corto (800Hz, 50ms) */
  STATION_CHANGE: {
    frequency: 800,
    duration: 50,
    type: 'sine' as OscillatorType,
    volume: 0.2,
  },
  /** Error: doble beep bajo (150Hz, [50ms, 50ms, 50ms]) */
  ERROR: {
    frequency: 150,
    duration: 50,
    pauseBetween: 50,
    repeat: 2,
    type: 'sine' as OscillatorType,
    volume: 0.3,
  },
} as const;

// Configuración global de feedback
export const FEEDBACK_CONFIG = {
  /** Habilitar/deshabilitar feedback háptico */
  hapticEnabled: true,
  /** Habilitar/deshabilitar feedback sonoro */
  soundEnabled: true,
  /** Volumen máximo para sonidos (0-1) */
  maxVolume: 0.3,
} as const;


