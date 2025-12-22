import { PlayCircle, PauseCircle } from 'lucide-react';
import { useRef } from 'react';

interface CoverArtProps {
  cover: string;
  isPlaying: boolean;
  onToggle: () => void;
  onSwipe?: (direction: 'left' | 'right') => void;
}

const SWIPE_THRESHOLD = 50;

export function CoverArt({ cover, isPlaying, onToggle, onSwipe }: CoverArtProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const swiped = useRef(false);

  return (
    <button
      onClick={onToggle}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        startX.current = touch.clientX;
        startY.current = touch.clientY;
        swiped.current = false;
      }}
      onTouchMove={(e) => {
        if (swiped.current || !onSwipe) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX.current;
        const dy = Math.abs(touch.clientY - startY.current);
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > dy) {
          swiped.current = true;
          onSwipe(dx > 0 ? 'right' : 'left');
        }
      }}
      onTouchEnd={(e) => {
        if (swiped.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className="w-full aspect-square max-h-[65vh] rounded-card shadow-xl transition-transform active:scale-95 group overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${cover}), linear-gradient(to bottom, var(--color-gray-100), var(--color-gray-200))`,
      }}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      <div className={`absolute inset-0 bg-black-20 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        {isPlaying ? (
          <PauseCircle className="w-12 h-12 text-white fill-current drop-shadow-md" />
        ) : (
          <PlayCircle className="w-12 h-12 text-white fill-current drop-shadow-md" />
        )}
      </div>
      <div className="absolute left-3 bottom-3 text-2xl">🔥</div>
    </button>
  );
}
