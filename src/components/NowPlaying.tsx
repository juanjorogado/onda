import { memo, useMemo } from 'react';

interface NowPlayingProps {
  title?: string;
  artist?: string;
  year?: number;
  stationName?: string;
}

export const NowPlaying = memo(({ title, artist, year, stationName }: NowPlayingProps) => {
  const text = useMemo(() => {
    if (title && artist) {
      return `${title} — ${artist}${year ? ` (${year})` : ''}`;
    } else if (title) {
      return `${title}${year ? ` (${year})` : ''}`;
    } else if (artist) {
      return `${artist}${year ? ` (${year})` : ''}`;
    } else if (stationName) {
      return `Sonando la radio ${stationName}`;
    }
    return '';
  }, [title, artist, year, stationName]);
  
  if (!text) return null;
  
  return (
    <div className="w-full overflow-hidden text-ink">
      <div className="marquee">
        <span className="text-xl font-normal inline-block whitespace-nowrap">{text}</span>
      </div>
    </div>
  );
});

NowPlaying.displayName = 'NowPlaying';
