interface NowPlayingProps {
  title?: string;
  artist?: string;
}

export function NowPlaying({ title, artist }: NowPlayingProps) {
  if (!title && !artist) return null;
  return (
    <div className="w-full mt-4">
      {title && <span className="text-l font-normal">{title}</span>}
      {title && artist && ' '}
      {artist && <span className="text-l font-light">{artist}</span>}
    </div>
  );
}
