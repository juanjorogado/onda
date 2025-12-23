import { formatTime } from '../utils/formatTime';

interface ClocksProps {
  time: Date;
  location: string;
  timezone: string;
  isBright?: boolean;
}

function ClockItem({ label, time, isBright }: { label: string; time: string; isBright: boolean }) {
  const textColor = isBright ? 'text-ink' : 'text-white';
  return (
    <div className="flex flex-col items-start">
      <span className={`text-m font-normal ${textColor}`}>{label}</span>
      <span className={`text-l font-light ${textColor}`}>{time}</span>
    </div>
  );
}

export function Clocks({ time, location, timezone, isBright = false }: ClocksProps) {
  return (
    <div className="absolute top-8 left-0 right-0 flex items-center gap-8 clock-backdrop">
      <ClockItem label="Hora local" time={formatTime(time)} isBright={isBright} />
      <ClockItem label={location} time={formatTime(time, timezone)} isBright={isBright} />
    </div>
  );
}
