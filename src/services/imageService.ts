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
 * @param city - Nombre de la ciudad (para variación)
 * @returns Objeto con colores HSL
 */
function getTimeBasedColors(timeOfDay: 'dawn' | 'day' | 'dusk' | 'night', city: string): {
  hue1: number;
  hue2: number;
  sat: number;
  light1: number;
  light2: number;
} {
  // Generar variación basada en la ciudad
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  const variation = Math.abs(hash) % 20; // Variación de 0-20 grados
  const darkMode = isDarkMode();
  
  // Ajustar saturación y claridad para dark mode
  const darkModeSatReduction = darkMode ? 20 : 0;
  const darkModeLightReduction = darkMode ? 15 : 0;

  switch (timeOfDay) {
    case 'dawn':
      // Amanecer: tonos rosas, naranjas suaves
      return {
        hue1: 15 + variation,      // Naranja-rosa
        hue2: 35 + variation,       // Naranja más cálido
        sat: Math.max(40, 70 + (variation % 15) - darkModeSatReduction), // Saturación alta
        light1: Math.max(25, 45 + (variation % 10) - darkModeLightReduction), // Claridad media
        light2: Math.max(35, 65 + (variation % 15) - darkModeLightReduction), // Claridad alta
      };
    case 'day':
      // Día: tonos azules claros
      return {
        hue1: 200 + (variation % 20), // Azul
        hue2: 220 + (variation % 20),  // Azul más claro
        sat: Math.max(30, 50 + (variation % 20) - darkModeSatReduction),    // Saturación media
        light1: Math.max(35, 60 + (variation % 15) - darkModeLightReduction), // Claridad alta
        light2: Math.max(45, 80 + (variation % 10) - darkModeLightReduction), // Claridad muy alta
      };
    case 'dusk':
      // Atardecer: tonos naranjas, rojos, púrpuras
      return {
        hue1: 10 + (variation % 15),   // Naranja-rojo
        hue2: 280 + (variation % 20),  // Púrpura
        sat: Math.max(45, 75 + (variation % 15) - darkModeSatReduction),    // Saturación alta
        light1: Math.max(25, 40 + (variation % 15) - darkModeLightReduction), // Claridad media-baja
        light2: Math.max(30, 55 + (variation % 15) - darkModeLightReduction), // Claridad media
      };
    case 'night':
      // Noche: tonos azules oscuros, púrpuras
      return {
        hue1: 240 + (variation % 20),  // Azul oscuro
        hue2: 270 + (variation % 20),  // Púrpura oscuro
        sat: Math.max(40, 60 + (variation % 20) - darkModeSatReduction),    // Saturación media-alta
        light1: Math.max(15, 20 + (variation % 10) - darkModeLightReduction), // Claridad baja
        light2: Math.max(20, 35 + (variation % 15) - darkModeLightReduction), // Claridad media-baja
      };
  }
}

/**
 * Genera un gradiente dinámico basado en la hora del día en la ciudad
 * @param city - Nombre de la ciudad
 * @param timezone - Zona horaria de la ciudad
 * @returns String de gradiente CSS
 */
function generateTimeBasedGradient(city: string, timezone: string): string {
  const hour = getHourInTimezone(timezone);
  const timeOfDay = getTimeOfDay(hour);
  const colors = getTimeBasedColors(timeOfDay, city);
  
  return `linear-gradient(135deg, hsl(${colors.hue1}, ${colors.sat}%, ${colors.light1}%) 0%, hsl(${colors.hue2}, ${colors.sat}%, ${colors.light2}%) 100%)`;
}

/**
 * Genera un gradiente CSS basado en la hora del día en la ciudad
 * @param city - Nombre de la ciudad
 * @param timezone - Zona horaria de la ciudad
 * @returns String de gradiente CSS
 */
export function getCityGradientFallback(city: string, timezone?: string): string {
  if (timezone) {
    return generateTimeBasedGradient(city, timezone);
  }
  // Fallback sin timezone (usar hora local)
  const hour = new Date().getHours();
  const timeOfDay = getTimeOfDay(hour);
  const colors = getTimeBasedColors(timeOfDay, city);
  return `linear-gradient(135deg, hsl(${colors.hue1}, ${colors.sat}%, ${colors.light1}%) 0%, hsl(${colors.hue2}, ${colors.sat}%, ${colors.light2}%) 100%)`;
}


