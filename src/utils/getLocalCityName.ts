import timezoneToCity from '../data/timezoneToCity.json';

/**
 * Obtiene el nombre de la ciudad basándose en la zona horaria local
 */
export function getLocalCityName(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Si tenemos un mapeo, usarlo
    if (timezone in timezoneToCity) {
      return timezoneToCity[timezone as keyof typeof timezoneToCity];
    }
    
    // Si no, extraer el nombre de la zona horaria (última parte después de /)
    const parts = timezone.split('/');
    if (parts.length > 1) {
      return parts[parts.length - 1].replace(/_/g, ' ');
    }
    
    return 'Local';
  } catch {
    return 'Local';
  }
}

