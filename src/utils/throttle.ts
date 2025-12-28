/**
 * Utilidades para optimizar actualizaciones frecuentes
 * Útiles para eventos que se disparan muchas veces (scroll, resize, etc.)
 */

/**
 * Throttle: Ejecuta la función como máximo una vez cada `delay` ms
 * Útil para limitar la frecuencia de actualizaciones
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    } else {
      // Si ya hay un timeout pendiente, cancelarlo
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Programar la siguiente ejecución
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func.apply(this, args);
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * Debounce: Ejecuta la función solo después de que haya pasado `delay` ms
 * sin que se haya vuelto a llamar
 * Útil para esperar a que el usuario termine de interactuar
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

