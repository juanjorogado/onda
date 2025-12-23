interface NowPlayingProps {
  title?: string;
  artist?: string;
  stationName?: string;
}

export function NowPlaying({ title, artist, stationName }: NowPlayingProps) {
  const text = title && artist 
    ? `${title} — ${artist}` 
    : title || artist || (stationName ? `Sonando la radio ${stationName}` : '');
  
  if (!text) return null;
  
  return (
    <div className="w-full overflow-hidden">
      <div className="marquee">
        <span className="text-l font-normal inline-block whitespace-nowrap">{text}</span>
      </div>
    </div>
  );
}
