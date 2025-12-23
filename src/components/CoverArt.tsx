import { useRef, ReactNode } from 'react';

interface CoverArtProps {
  cover: string;
  onToggle: () => void;
  onSwipe?: (direction: 'left' | 'right') => void;
  children?: ReactNode;
}

const SWIPE_THRESHOLD = 50;

export function CoverArt({ cover, onToggle, onSwipe, children }: CoverArtProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const swiped = useRef(false);

  return (
    <div
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
      className="w-full flex-1 rounded-card overflow-hidden relative bg-cover bg-center bg-no-repeat min-h-0 cursor-pointer"
      style={{
        backgroundImage: `url(${cover}), linear-gradient(to bottom, var(--color-gray-100), var(--color-gray-200))`,
      }}
    >
      {children}
      <div className="absolute left-3 bottom-3 text-2xl">🔥</div>
    </div>
  );
}
