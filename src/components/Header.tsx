import { memo } from 'react';

interface HeaderProps {
  name: string;
  location: string;
  isPlaying: boolean;
}

export const Header = memo(({ name, location, isPlaying }: HeaderProps) => {
  return (
    <div className="flex px-4 items-center gap-2 self-stretch text-ink" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
      <div className={`wave-container ${isPlaying ? 'playing' : ''}`}>
        <span className="wave-circle"></span>
        <span className="wave-circle"></span>
      </div>
      <div className="text-m tracking-wide flex-1 min-w-0 truncate text-transition">
        <span className="font-normal text-fade-in">{name}</span> {location && <span className="font-light text-fade-in">— {location}</span>}
      </div>
    </div>
  );
});

Header.displayName = 'Header';
