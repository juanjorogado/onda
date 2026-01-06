import { memo } from 'react';
import { useCurrentTime } from '../hooks/useCurrentTime';

export const WaitingScreen = memo(() => {
  const time = useCurrentTime();
  
  // Formatear hora como 17:00
  const formattedTime = time.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="waiting-screen-container">
      <div className="waiting-screen-board">
        {/* Station Section */}
        <div className="waiting-screen-station">
          {/* Onda Logo */}
          <div className="waiting-screen-onda">
            <div className="waiting-screen-ellipse-outer"></div>
            <div className="waiting-screen-ellipse-inner"></div>
          </div>
          
          {/* Board with Madrid and Time */}
          <div className="waiting-screen-station-board">
            <div className="waiting-screen-madrid">Madrid</div>
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
        <div className="waiting-screen-indicator-ellipse-outer"></div>
        <div className="waiting-screen-indicator-ellipse-inner"></div>
      </div>
    </div>
  );
});

WaitingScreen.displayName = 'WaitingScreen';

