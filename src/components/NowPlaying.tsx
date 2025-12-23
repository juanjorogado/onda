interface NowPlayingProps {
  title?: string;
  artist?: string;
}

export function NowPlaying({ title, artist }: NowPlayingProps) {
  if (!title && !artist) return null;
  const text = title && artist ? `${title} — ${artist}` : title || artist || '';
  return (
    <div className="w-full overflow-hidden">
      <div className="marquee">
        <span className="text-l font-normal inline-block whitespace-nowrap">{text}</span>
      </div>
    </div>
  );
}
