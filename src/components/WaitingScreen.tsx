import { memo, useMemo } from 'react';
import { useCurrentTime } from '../hooks/useCurrentTime';

/**
 * Obtiene el nombre de la ciudad basándose en la zona horaria local
 */
function getLocalCityName(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Mapeo de zonas horarias comunes a nombres de ciudades
    const timezoneToCity: Record<string, string> = {
      'Europe/Madrid': 'Madrid',
      'Europe/London': 'London',
      'Europe/Paris': 'Paris',
      'Europe/Berlin': 'Berlin',
      'Europe/Rome': 'Rome',
      'Europe/Amsterdam': 'Amsterdam',
      'Europe/Brussels': 'Brussels',
      'Europe/Vienna': 'Vienna',
      'Europe/Zurich': 'Zurich',
      'America/New_York': 'New York',
      'America/Los_Angeles': 'Los Angeles',
      'America/Chicago': 'Chicago',
      'America/Denver': 'Denver',
      'America/Phoenix': 'Phoenix',
      'America/Toronto': 'Toronto',
      'America/Mexico_City': 'Mexico City',
      'America/Sao_Paulo': 'São Paulo',
      'America/Buenos_Aires': 'Buenos Aires',
      'America/Santiago': 'Santiago',
      'Asia/Tokyo': 'Tokyo',
      'Asia/Shanghai': 'Shanghai',
      'Asia/Hong_Kong': 'Hong Kong',
      'Asia/Singapore': 'Singapore',
      'Asia/Dubai': 'Dubai',
      'Asia/Mumbai': 'Mumbai',
      'Australia/Sydney': 'Sydney',
      'Australia/Melbourne': 'Melbourne',
      'Pacific/Auckland': 'Auckland',
    };
    
    // Si tenemos un mapeo, usarlo
    if (timezoneToCity[timezone]) {
      return timezoneToCity[timezone];
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

export const WaitingScreen = memo(() => {
  const time = useCurrentTime();
  
  // Obtener ciudad local
  const localCity = useMemo(() => getLocalCityName(), []);
  
  // Formatear hora local como 17:00
  const formattedTime = useMemo(() => {
    return time.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }, [time]);

  return (
    <div className="waiting-screen-container">
      <div className="waiting-screen-board">
        {/* Station Section */}
        <div className="waiting-screen-station">
          {/* Onda Logo */}
          <div className="waiting-screen-onda">
            <div className="waiting-screen-ellipse-inner"></div>
          </div>
          
          {/* Board with Local City and Time */}
          <div className="waiting-screen-station-board">
            <div className="waiting-screen-madrid">{localCity}</div>
            <div className="waiting-screen-time">{formattedTime}</div>
          </div>
        </div>

        {/* Cover */}
        <div className="waiting-screen-cover"></div>

        {/* Text */}
        <div className="waiting-screen-text">Pulsa para escuchar </div>
      </div>

      {/* Waiting Indicator */}
      <div className="waiting-screen-indicator">
        <div className="waiting-screen-indicator-ellipse-inner"></div>
      </div>
    </div>
  );
});

WaitingScreen.displayName = 'WaitingScreen';


