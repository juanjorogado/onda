interface HeaderProps {
  name: string;
  location: string;
  isPlaying: boolean;
}

export function Header({ name, location, isPlaying }: HeaderProps) {
  return (
    <div className="flex px-4 items-center gap-2 self-stretch text-ink">
      <div className={`wave-container ${isPlaying ? 'playing' : ''}`}>
        <span className="wave-circle"></span>
        <span className="wave-circle"></span>
      </div>
      <div className="text-m tracking-wide flex-1 min-w-0 truncate">
        <span className="font-normal">{name}</span> <span className="font-light">— {location}</span>
      </div>
    </div>
  );
}
