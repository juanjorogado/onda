interface NowPlayingProps {
  title?: string;
  artist?: string;
}

export function NowPlaying({ title, artist }: NowPlayingProps) {
  if (!title && !artist) return null;
  return (
    <div className="w-full overflow-hidden">
      {title && artist ? (
        <>
          <span className="text-l font-normal">{title}</span>
          {' '}
          <span className="text-l font-light-300">— {artist}</span>
        </>
      ) : (
        <>
          {title && <span className="text-l font-normal block truncate">{title}</span>}
          {artist && <span className="text-l font-light-300 block truncate">{artist}</span>}
        </>
      )}
    </div>
  );
}
