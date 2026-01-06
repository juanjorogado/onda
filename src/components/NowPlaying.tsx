import { memo, useMemo } from 'react';

interface NowPlayingProps {
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  stationName?: string;
  className?: string;
  fontSize?: 'm' | 'xl';
}

export const NowPlaying = memo(({ title, artist, album, year, stationName, className, fontSize = 'xl' }: NowPlayingProps) => {
  const text = useMemo(() => {
    if (title && artist) {
      const parts = [title, artist];
      if (album) {
        parts.push(album);
      }
      const mainText = parts.join(' — ');
      return year ? `${mainText} (${year})` : mainText;
    } else if (title) {
      const parts = [title];
      if (album) {
        parts.push(album);
      }
      const mainText = parts.join(' — ');
      return year ? `${mainText} (${year})` : mainText;
    } else if (artist) {
      const parts = [artist];
      if (album) {
        parts.push(album);
      }
      const mainText = parts.join(' — ');
      return year ? `${mainText} (${year})` : mainText;
    } else if (stationName) {
      return `Sonando la radio ${stationName}`;
    }
    return '';
  }, [title, artist, album, year, stationName]);
  
  if (!text) return null;
  
  const fontSizeClass = fontSize === 'm' ? 'text-m' : 'text-xl';
  
  return (
    <div className={`w-full overflow-hidden text-ink ${className || ''}`}>
      <div className="marquee">
        <span className={`${fontSizeClass} font-normal inline-block whitespace-nowrap`}>{text}</span>
      </div>
    </div>
  );
});

NowPlaying.displayName = 'NowPlaying';
