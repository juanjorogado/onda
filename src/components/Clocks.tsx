import { formatTime } from '../utils/formatTime';

interface ClocksProps {
  time: Date;
  location: string;
  timezone: string;
}

function ClockItem({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-m font-normal text-ink">{label}</span>
      <span className="text-l font-light">{time}</span>
    </div>
  );
}

export function Clocks({ time, location, timezone }: ClocksProps) {
  return (
    <div className="flex items-center gap-8 px-3 self-stretch">
      <ClockItem label="Hora local" time={formatTime(time)} />
      <ClockItem label={location} time={formatTime(time, timezone)} />
    </div>
  );
}
