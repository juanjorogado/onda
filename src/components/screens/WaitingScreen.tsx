import { memo, useMemo } from 'react';
import { useCurrentTime } from '../../hooks/time/useCurrentTime';
import { formatTime } from '../../utils/formatTime';
import { getLocalCityName } from '../../utils/getLocalCityName';

export const WaitingScreen = memo(() => {
  const time = useCurrentTime();
  
  const localCity = useMemo(() => getLocalCityName(), []);
  const formattedTime = useMemo(() => formatTime(time), [time]);

  return (
    <div className="waiting-screen-container">
      <div className="waiting-screen-board">
        <div className="waiting-screen-station">
          <div className="waiting-screen-onda">
            <div className="waiting-screen-ellipse-inner"></div>
          </div>
          
          <div className="waiting-screen-station-board">
            <div className="waiting-screen-city">{localCity}</div>
            <div className="waiting-screen-time">{formattedTime}</div>
          </div>
        </div>

        <div className="waiting-screen-cover"></div>
        <div className="waiting-screen-text">Pulsa para escuchar</div>
      </div>

      <div className="waiting-screen-indicator">
        <div className="waiting-screen-indicator-ellipse-inner"></div>
      </div>
    </div>
  );
});

WaitingScreen.displayName = 'WaitingScreen';


