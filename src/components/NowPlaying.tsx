interface NowPlayingProps {
  title?: string;
  artist?: string;
}

export function NowPlaying({ title, artist }: NowPlayingProps) {
  if (!title && !artist) return null;
  return (
    <div className="w-full mt-4 overflow-hidden">
      {title && <span className="text-l font-normal block truncate">{title}</span>}
      {artist && <span className="text-l font-light block truncate">{artist}</span>}
    </div>
  );
}
