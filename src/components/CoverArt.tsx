import { Play, Pause } from 'lucide-react';
import { useRef } from 'react';

export function CoverArt({
  cover,
  isPlaying,
  onToggle,
  onSwipe,
}: {
  cover: string;
  isPlaying: boolean;
  onToggle: () => void;
  onSwipe?: (direction: 'left' | 'right') => void;
}) {
  const startX = useRef(0);
  const startY = useRef(0);
  const swiped = useRef(false);
  const threshold = 50;

  return (
    <button
      onClick={onToggle}
      onTouchStart={(e) => {
        const t = e.touches[0];
        startX.current = t.clientX;
        startY.current = t.clientY;
        swiped.current = false;
      }}
      onTouchMove={(e) => {
        if (swiped.current) return;
        const t = e.touches[0];
        const dx = t.clientX - startX.current;
        const dy = t.clientY - startY.current;
        if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
          swiped.current = true;
          if (onSwipe) onSwipe(dx > 0 ? 'right' : 'left');
        }
      }}
      onTouchEnd={(e) => {
        if (swiped.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className="w-full h-[65vh] rounded-card shadow-xl transition-transform active:scale-95 group overflow-hidden relative"
      style={{
        backgroundImage: `url(${cover}), linear-gradient(to bottom, #f3f4f6, #e5e7eb)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      <div
        className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-12 h-12 text-white fill-current drop-shadow-md" />
        ) : (
          <Play className="w-12 h-12 text-white fill-current ml-1 drop-shadow-md" />
        )}
      </div>
      <div className="absolute left-3 bottom-3 text-2xl">🔥</div>
    </button>
  );
}
