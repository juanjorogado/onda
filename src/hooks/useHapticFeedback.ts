import { useCallback, useRef, useEffect } from 'react';
import { HAPTIC_PATTERNS, SOUND_CONFIG, FEEDBACK_CONFIG } from '../constants';

/**
 * Opciones de configuración para el feedback
 */
interface HapticFeedbackOptions {
  /** Habilitar/deshabilitar vibración */
  hapticEnabled?: boolean;
  /** Habilitar/deshabilitar sonido */
  soundEnabled?: boolean;
  /** Volumen de los sonidos (0-1) */
  volume?: number;
}

/**
 * Hook para proporcionar feedback háptico y sonoro
 * Optimizado para uso en coche - permite confirmar acciones sin mirar la pantalla
 *
 * Características:
 * - Feature detection para vibración y audio
 * - Sonidos suaves que no molestan mientras se conduce
 * - Compatible con iOS Safari y Android Chrome
 */
export function useHapticFeedback(options: HapticFeedbackOptions = {}) {
  const {
    hapticEnabled = FEEDBACK_CONFIG.hapticEnabled,
    soundEnabled = FEEDBACK_CONFIG.soundEnabled,
    volume = FEEDBACK_CONFIG.maxVolume,
  } = options;

  // Referencia al contexto de audio para reutilización
  const audioContextRef = useRef<AudioContext | null>(null);

  // Limpiar el audio context al desmontar
  useEffect(() => {
    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close().catch(() => {
          // Ignorar errores al cerrar
        });
      }
    };
  }, []);

  /**
   * Obtiene o crea el AudioContext
   * Se crea lazy-loaded para evitar problemas en iOS (requiere interacción del usuario)
   */
  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;

    // Reutilizar el contexto existente si está disponible
    if (audioContextRef.current?.state === 'running') {
      return audioContextRef.current;
    }

    // Crear nuevo contexto si es necesario
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;

      audioContextRef.current = new AudioContextClass();
      return audioContextRef.current;
    } catch {
      return null;
    }
  }, []);

  /**
   * Reproduce un patrón de vibración
   * @param pattern - Patrón de vibración de HAPTIC_PATTERNS o array personalizado
   */
  const vibrate = useCallback((pattern: number | number[] | readonly number[]): void => {
    if (!hapticEnabled || typeof navigator === 'undefined') return;

    // Feature detection para Vibration API
    if (!('vibrate' in navigator) || typeof navigator.vibrate !== 'function') {
      return;
    }

    try {
      navigator.vibrate(pattern as number | number[]);
    } catch {
      // Ignorar errores silenciosamente (algunos dispositivos pueden fallar)
    }
  }, [hapticEnabled]);

  /**
   * Reproduce un tono simple
   * @param frequency - Frecuencia en Hz
   * @param duration - Duración en ms
   * @param type - Tipo de onda del oscilador
   */
  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine'
  ): void => {
    if (!soundEnabled) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Crear oscilador y ganancia
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Configurar oscilador
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Configurar volumen con fade out suave
      const actualVolume = Math.min(volume, FEEDBACK_CONFIG.maxVolume);
      gainNode.gain.setValueAtTime(actualVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      // Conectar y reproducir
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch {
      // Ignorar errores silenciosamente
    }
  }, [soundEnabled, volume, getAudioContext]);

  /**
   * Reproduce un tono con sweep de frecuencia
   * @param freqStart - Frecuencia inicial en Hz
   * @param freqEnd - Frecuencia final en Hz
   * @param duration - Duración en ms
   * @param type - Tipo de onda del oscilador
   */
  const playSweep = useCallback((
    freqStart: number,
    freqEnd: number,
    duration: number,
    type: OscillatorType = 'sine'
  ): void => {
    if (!soundEnabled) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freqStart, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(freqEnd, ctx.currentTime + duration / 1000);

      const actualVolume = Math.min(volume, FEEDBACK_CONFIG.maxVolume);
      gainNode.gain.setValueAtTime(actualVolume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch {
      // Ignorar errores silenciosamente
    }
  }, [soundEnabled, volume, getAudioContext]);

  /**
   * Reproduce un doble beep para errores
   */
  const playDoubleBeep = useCallback((): void => {
    if (!soundEnabled) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    const { frequency, duration, pauseBetween, type, volume: soundVolume } = SOUND_CONFIG.ERROR;
    const actualVolume = Math.min(volume, soundVolume, FEEDBACK_CONFIG.maxVolume);

    try {
      // Primer beep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = type;
      osc1.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain1.gain.setValueAtTime(actualVolume, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + duration / 1000);

      // Segundo beep
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = type;
      osc2.frequency.setValueAtTime(frequency, ctx.currentTime + (duration + pauseBetween) / 1000);
      gain2.gain.setValueAtTime(actualVolume, ctx.currentTime + (duration + pauseBetween) / 1000);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (duration + pauseBetween + duration) / 1000);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + (duration + pauseBetween) / 1000);
      osc2.stop(ctx.currentTime + (duration + pauseBetween + duration) / 1000);
    } catch {
      // Ignorar errores silenciosamente
    }
  }, [soundEnabled, volume, getAudioContext]);

  // ============================================
  // Métodos de conveniencia para acciones específicas
  // ============================================

  /** Feedback ligero para toques simples */
  const tap = useCallback((): void => {
    vibrate(HAPTIC_PATTERNS.TAP);
  }, [vibrate]);

  /** Feedback de éxito con sonido */
  const success = useCallback((): void => {
    vibrate(HAPTIC_PATTERNS.SUCCESS);
  }, [vibrate]);

  /** Feedback de error con sonido */
  const error = useCallback((): void => {
    vibrate(HAPTIC_PATTERNS.ERROR);
    playDoubleBeep();
  }, [vibrate, playDoubleBeep]);

  /** Feedback de advertencia */
  const warning = useCallback((): void => {
    vibrate(HAPTIC_PATTERNS.WARNING);
  }, [vibrate]);

  /** Feedback al cambiar de estación */
  const stationChange = useCallback((): void => {
    vibrate(HAPTIC_PATTERNS.STATION_CHANGE);
    const { frequency, duration, type } = SOUND_CONFIG.STATION_CHANGE;
    playTone(frequency, duration, type);
  }, [vibrate, playTone]);

  /** Feedback al iniciar reproducción */
  const play = useCallback((): void => {
    tap();
    const { frequencyStart, frequencyEnd, duration, type } = SOUND_CONFIG.PLAY;
    playSweep(frequencyStart, frequencyEnd, duration, type);
  }, [tap, playSweep]);

  /** Feedback al pausar reproducción */
  const pause = useCallback((): void => {
    tap();
    const { frequencyStart, frequencyEnd, duration, type } = SOUND_CONFIG.PAUSE;
    playSweep(frequencyStart, frequencyEnd, duration, type);
  }, [tap, playSweep]);

  /** Feedback para swipe completado */
  const swipe = useCallback((): void => {
    vibrate(HAPTIC_PATTERNS.STATION_CHANGE);
  }, [vibrate]);

  return {
    // Métodos principales
    vibrate,
    playTone,
    playSweep,

    // Métodos de conveniencia
    tap,
    success,
    error,
    warning,
    stationChange,
    play,
    pause,
    swipe,

    // Estado
    isHapticSupported: typeof navigator !== 'undefined' && 'vibrate' in navigator,
    isAudioSupported: typeof window !== 'undefined' && !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext),
  };
}

export default useHapticFeedback;
