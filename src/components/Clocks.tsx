import { formatTime } from '../utils/formatTime';

interface ClocksProps {
  time: Date;
  location: string;
  timezone: string;
  isBright?: boolean;
  hasTrackInfo?: boolean;
}

function ClockItem({ label, time, isBright }: { label: string; time: string; isBright: boolean }) {
  // Si hay mucho brillo (brightness > 0.5), usar text-ink (negro), sino text-white (blanco)
  const textColor = isBright ? 'text-ink' : 'text-white';
  return (
    <div className="flex flex-col items-start">
      <span className={`text-m font-normal ${textColor}`}>{label}</span>
      <span className={`text-l font-light ${textColor}`}>{time}</span>
    </div>
  );
}

export function Clocks({ time, location, timezone, isBright = false, hasTrackInfo = false }: ClocksProps) {
  return (
    <div className={`absolute left-0 right-0 flex items-center gap-8 ${hasTrackInfo ? 'clock-backdrop' : 'px-4'}`} style={{ top: '16px' }}>
      <ClockItem label="Hora local" time={formatTime(time)} isBright={isBright} />
      <ClockItem label={location} time={formatTime(time, timezone)} isBright={isBright} />
    </div>
  );
}
