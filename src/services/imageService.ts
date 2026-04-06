/**
 * Obtiene la hora actual en una zona horaria específica
 * @param timezone - Zona horaria (ej: 'America/New_York')
 * @returns Hora del día (0-23)
 */
function getHourInTimezone(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    });
    const hour = parseInt(formatter.format(now), 10);
    return hour;
  } catch {
    // Fallback a hora local
    return new Date().getHours();
  }
}

/**
 * Determina el período del día basado en la hora
 * @param hour - Hora del día (0-23)
 * @returns Período del día: 'dawn' | 'day' | 'dusk' | 'night'
 */
function getTimeOfDay(hour: number): 'dawn' | 'day' | 'dusk' | 'night' {
  if (hour >= 5 && hour < 7) return 'dawn';    // 5-7 AM: Amanecer
  if (hour >= 7 && hour < 18) return 'day';    // 7 AM-6 PM: Día
  if (hour >= 18 && hour < 20) return 'dusk';  // 6-8 PM: Atardecer
  return 'night';                               // 8 PM-5 AM: Noche
}

/** Ángulo único: transición suave, sin variar por franja (menos ruido visual). */
const GRADIENT_ANGLE_DEG = 138;

/**
 * Detecta si el sistema está en modo oscuro
 * @returns true si está en dark mode
 */
function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Genera colores de gradiente según el período del día
 * @param timeOfDay - Período del día
 * @param city - Nombre de la ciudad (variación muy sutil entre ciudades)
 * @returns Objeto con colores HSL (dos paradas, gamas análogas — sin saltos tipo “arcoíris”)
 */
function getTimeBasedColors(timeOfDay: 'dawn' | 'day' | 'dusk' | 'night', city: string): {
  hue1: number;
  hue2: number;
  sat: number;
  light1: number;
  light2: number;
} {
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Poca variación: la UI no debe “gritar” distinto por ciudad (filosofía: discreto)
  const variation = Math.abs(hash) % 9;
  const darkMode = isDarkMode();

  const darkModeSatReduction = darkMode ? 18 : 0;
  const darkModeLightReduction = darkMode ? 12 : 0;

  switch (timeOfDay) {
    case 'dawn':
      // Rosas y melocotón cercanos en el círculo cromático (~18° de separación máx.)
      return {
        hue1: 24 + variation,
        hue2: 14 + variation,
        sat: Math.max(38, 52 + (variation % 6) - darkModeSatReduction),
        light1: Math.max(28, 48 + (variation % 5) - darkModeLightReduction),
        light2: Math.max(36, 62 + (variation % 6) - darkModeLightReduction),
      };
    case 'day':
      // Azul día: matiz contenido (no cyan-neón)
      return {
        hue1: 208 + (variation % 5),
        hue2: 218 + (variation % 5),
        sat: Math.max(28, 42 + (variation % 6) - darkModeSatReduction),
        light1: Math.max(38, 58 + (variation % 5) - darkModeLightReduction),
        light2: Math.max(48, 76 + (variation % 4) - darkModeLightReduction),
      };
    case 'dusk':
      // Caliente y análogo: naranja → ámbar (sin salto a púrpura)
      return {
        hue1: 26 + (variation % 6),
        hue2: 14 + (variation % 5),
        sat: Math.max(40, 56 + (variation % 7) - darkModeSatReduction),
        light1: Math.max(26, 42 + (variation % 5) - darkModeLightReduction),
        light2: Math.max(32, 52 + (variation % 6) - darkModeLightReduction),
      };
    case 'night':
      // Azul profundo → índigo (vecinos en H)
      return {
        hue1: 236 + (variation % 6),
        hue2: 248 + (variation % 6),
        sat: Math.max(36, 50 + (variation % 6) - darkModeSatReduction),
        light1: Math.max(16, 22 + (variation % 4) - darkModeLightReduction),
        light2: Math.max(22, 32 + (variation % 5) - darkModeLightReduction),
      };
  }
}

/**
 * Genera un gradiente dinámico basado en la hora del día en la ciudad
 * @param city - Nombre de la ciudad
 * @param timezone - Zona horaria de la ciudad (opcional, usa hora local si no se proporciona)
 * @returns String de gradiente CSS
 */
export function getCityGradientFallback(city: string, timezone?: string): string {
  const hour = timezone ? getHourInTimezone(timezone) : new Date().getHours();
  const timeOfDay = getTimeOfDay(hour);
  const colors = getTimeBasedColors(timeOfDay, city);

  // Dos paradas: suficiente profundidad sin competir con el contenido (Rams / filosofía Onda)
  return `linear-gradient(${GRADIENT_ANGLE_DEG}deg, hsl(${colors.hue1}, ${colors.sat}%, ${colors.light1}%) 0%, hsl(${colors.hue2}, ${colors.sat}%, ${colors.light2}%) 100%)`;
}

