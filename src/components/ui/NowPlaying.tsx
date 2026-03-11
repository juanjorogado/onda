import { memo, useMemo, useRef, useEffect, useState } from 'react';

interface NowPlayingProps {
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  stationName?: string;
  isPlaying?: boolean;
  className?: string;
}

// Separador para el marquee (espacios entre repeticiones)
const MARQUEE_SEPARATOR = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'; // 20 espacios no separables

const formatTrackInfo = (
  title?: string,
  artist?: string,
  album?: string,
  year?: number,
  stationName?: string,
  isPlaying?: boolean
): string => {
  if (!isPlaying) {
    return stationName ? `Pulsa para escuchar ${stationName}` : '';
  }

  if (title && artist) {
    const parts = [title, artist];

    if (album && year) {
      parts.push(`${album} (${year})`);
    } else if (album) {
      parts.push(album);
    } else if (year) {
      parts.push(`(${year})`);
    }

    return parts.length === 2
      ? `${parts[0]}. ${parts[1]}`
      : `${parts[0]}. ${parts[1]} — ${parts[2]}`;
  }

  const mainText = title || artist;
  if (mainText) {
    const metadata = [];
    if (album) metadata.push(album);
    if (year) metadata.push(`(${year})`);

    return metadata.length > 0
      ? `${mainText} — ${metadata.join(' ')}`
      : mainText;
  }

  return stationName ? `Sonando ${stationName}` : '';
};

export const NowPlaying = memo(({ 
  title,
  artist,
  album,
  year,
  stationName,
  isPlaying,
  className = '' 
}: NowPlayingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [duration, setDuration] = useState(20);
  
  const text = useMemo(
    () => formatTrackInfo(title, artist, album, year, stationName, isPlaying),
    [title, artist, album, year, stationName, isPlaying]
  );
  
  // Siempre animamos el marquee para que se mueva incluso con texto corto
  useEffect(() => {
    const checkScroll = () => {
      if (!containerRef.current || !textRef.current || !text) return;
      
      // Medir el ancho total del contenido
      const fullContentWidth = containerRef.current.scrollWidth;
      
      // Velocidad constante: ~50px por segundo
      // Dividimos por 2 porque la animación solo mueve el 50% del contenido
      const newDuration = Math.max(10, (fullContentWidth / 2) / 50);
      setDuration(newDuration);
    };

    // Ejecutar después de un pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(checkScroll, 100);
    
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkScroll);
    };
  }, [text]);
  
  if (!text) return null;
  
  return (
    <div key={text} ref={containerRef} className={`overflow-hidden text-ink animate-fade-in ${className}`}>
      <div className="marquee is-scrolling">
        <div 
          className="marquee-content"
          style={{ 
            animationDuration: `${duration}s`,
            animationPlayState: 'running'
          }}
        >
          <span ref={textRef} className="text-xl font-normal">
            {text}
          </span>
          {(
            <>
              <span className="marquee-separator">{MARQUEE_SEPARATOR}</span>
              <span className="text-xl font-normal">
                {text}
              </span>
              <span className="marquee-separator">{MARQUEE_SEPARATOR}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

NowPlaying.displayName = 'NowPlaying';
