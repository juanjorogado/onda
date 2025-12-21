export function NowPlaying({
  title,
  artist,
}: {
  title?: string;
  artist?: string;
}) {
  if (!title && !artist) return null;
  return (
    <div className="w-full mt-4">
      <span className="text-l font-normal">{title}</span>{' '}
      <span className="text-l font-light">{artist}</span>
    </div>
  );
}
