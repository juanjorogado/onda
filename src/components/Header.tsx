import { memo, useMemo } from 'react';
import { formatTime } from '../utils/formatTime';

interface HeaderProps {
  name: string;
  location: string;
  isPlaying: boolean;
  time: Date;
  timezone?: string;
}

export const Header = memo(({ name, location, isPlaying, time, timezone }: HeaderProps) => {
  // El location debe ser siempre el de la estación de radio cargada actualmente
  // La hora debe ser la hora de la ciudad de la estación cargada
  const stationTime = useMemo(() => formatTime(time, timezone), [time, timezone]);

  return (
    <div className="flex px-4 items-center gap-2 self-stretch text-ink flex-shrink-0" style={{ paddingTop: '8px', paddingBottom: '16px' }}>
      <div className={`wave-container ${isPlaying ? 'playing' : ''}`}>
        <span className="wave-circle"></span>
        <span className="wave-circle"></span>
      </div>
      <div className="text-m tracking-wide flex-1 min-w-0 truncate text-transition flex items-center justify-between">
        <div className="min-w-0 truncate">
          <span className="font-normal text-fade-in">{name}</span> {location && <span className="font-light text-fade-in">— {location}</span>}
        </div>
        {timezone && (
          <div className="text-m font-bold text-fade-in tabular-nums ml-2 flex-shrink-0">
            {stationTime}
          </div>
        )}
      </div>
    </div>
  );
});

Header.displayName = 'Header';
