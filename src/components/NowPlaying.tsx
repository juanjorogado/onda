interface NowPlayingProps {
  title?: string;
  artist?: string;
  year?: number;
  stationName?: string;
}

export function NowPlaying({ title, artist, year, stationName }: NowPlayingProps) {
  let text = '';
  
  if (title && artist) {
    text = `${title} — ${artist}`;
    if (year) {
      text += ` (${year})`;
    }
  } else if (title) {
    text = title;
    if (year) {
      text += ` (${year})`;
    }
  } else if (artist) {
    text = artist;
    if (year) {
      text += ` (${year})`;
    }
  } else if (stationName) {
    text = `Sonando la radio ${stationName}`;
  }
  
  if (!text) return null;
  
  return (
    <div className="w-full overflow-hidden">
      <div className="marquee">
        <span className="text-l font-normal inline-block whitespace-nowrap">{text}</span>
      </div>
    </div>
  );
}
