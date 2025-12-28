import { useEffect, useState, useRef } from 'react';
import { TIME_UPDATE_INTERVAL } from '../constants';

/**
 * Hook optimizado para obtener la hora actual
 * Actualiza cada segundo pero solo re-renderiza cuando cambia el segundo
 */
export function useCurrentTime() {
  const [time, setTime] = useState(() => new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Limpiar intervalo anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Actualizar inmediatamente
    setTime(new Date());

    // Configurar intervalo para actualizar cada segundo
    intervalRef.current = setInterval(() => {
      const now = new Date();
      // Solo actualizar si cambió el segundo para evitar re-renders innecesarios
      setTime((prev) => {
        if (prev.getSeconds() !== now.getSeconds()) {
          return now;
        }
        return prev;
      });
    }, TIME_UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return time;
}
