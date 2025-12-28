import { memo, useMemo } from 'react';
import { formatTime } from '../utils/formatTime';

interface ClocksProps {
  time: Date;
  location: string;
  timezone: string;
  isBright?: boolean;
}

const ClockItem = memo(({ label, time, isBright }: { label: string; time: string; isBright: boolean }) => {
  // Si hay mucho brillo (brightness > 0.5), usar text-ink (negro), sino text-white (blanco)
  const textColor = isBright ? 'text-ink' : 'text-white';
  return (
    <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
      <span className={`text-xs font-normal uppercase tracking-wider opacity-80 ${textColor} text-fade-in`}>
        {label}
      </span>
      <span className={`text-3xl font-light ${textColor} text-fade-in tabular-nums`}>
        {time}
      </span>
    </div>
  );
});

ClockItem.displayName = 'ClockItem';

export const Clocks = memo(({ time, location, timezone, isBright = false }: ClocksProps) => {
  const localTime = useMemo(() => formatTime(time), [time]);
  const stationTime = useMemo(() => formatTime(time, timezone), [time, timezone]);

  return (
    <div className="clocks-container">
      <div className="clocks-content">
        <ClockItem label="Hora local" time={localTime} isBright={isBright} />
        <div className="clocks-divider" />
        <ClockItem label={location} time={stationTime} isBright={isBright} />
      </div>
    </div>
  );
});

Clocks.displayName = 'Clocks';
