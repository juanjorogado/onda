import { formatTime } from '../scripts/formatTime';

export function Clocks({
  time,
  location,
  timezone,
}: {
  time: Date;
  location: string;
  timezone: string;
}) {
  return (
    <div className="flex items-center gap-8 self-stretch">
      <div className="flex flex-col items-start">
        <span className="text-m font-regular text-ink-400">Hora local</span>
        <span className="text-l font-light">
          {formatTime(time)}
        </span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-m font-regular text-ink-400">{location}</span>
        <span className="text-l font-light">
          {formatTime(time, timezone)}
        </span>
      </div>
    </div>
  );
}
