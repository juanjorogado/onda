import { formatTime } from '../utils/formatTime';

interface ClocksProps {
  time: Date;
  location: string;
  timezone: string;
}

function ClockItem({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-m font-normal text-white">{label}</span>
      <span className="text-l font-light text-white">{time}</span>
    </div>
  );
}

export function Clocks({ time, location, timezone }: ClocksProps) {
  return (
    <div className="absolute top-8 left-0 right-0 flex items-center gap-8 clock-backdrop">
      <ClockItem label="Hora local" time={formatTime(time)} />
      <ClockItem label={location} time={formatTime(time, timezone)} />
    </div>
  );
}
