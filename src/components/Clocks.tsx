import { formatTime } from '../utils/formatTime';

interface ClocksProps {
  time: Date;
  location: string;
  timezone: string;
  isBright?: boolean;
  hasTrackInfo?: boolean;
}

function ClockItem({ label, time, isBright, hasTrackInfo }: { label: string; time: string; isBright: boolean; hasTrackInfo: boolean }) {
  const textColor = hasTrackInfo ? 'text-white' : (isBright ? 'text-ink' : 'text-white');
  return (
    <div className="flex flex-col items-start">
      <span className={`text-m font-normal ${textColor}`}>{label}</span>
      <span className={`text-l font-light ${textColor}`}>{time}</span>
    </div>
  );
}

export function Clocks({ time, location, timezone, isBright = false, hasTrackInfo = false }: ClocksProps) {
  return (
    <div className={`absolute top-4 left-0 right-0 flex items-center gap-8 ${hasTrackInfo ? 'clock-backdrop' : 'px-4'}`}>
      <ClockItem label="Hora local" time={formatTime(time)} isBright={isBright} hasTrackInfo={hasTrackInfo} />
      <ClockItem label={location} time={formatTime(time, timezone)} isBright={isBright} hasTrackInfo={hasTrackInfo} />
    </div>
  );
}
