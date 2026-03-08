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
  const [shouldScroll, setShouldScroll] = useState(false);
  const [duration, setDuration] = useState(20);
  
  const text = useMemo(
    () => formatTrackInfo(title, artist, album, year, stationName, isPlaying),
    [title, artist, album, year, stationName, isPlaying]
  );
  
  // Detectar si el texto es más ancho que el contenedor
  useEffect(() => {
    const checkScroll = () => {
      if (!containerRef.current || !textRef.current || !text) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      // Usamos el scrollWidth del span interno que contiene el texto original
      const textWidth = textRef.current.scrollWidth;
      
      // Siempre permitir scroll si el usuario lo prefiere, o si el texto es largo
      const needsScroll = textWidth > containerWidth - 20; 
      setShouldScroll(needsScroll);

      if (needsScroll) {
        // Velocidad constante: ~50px por segundo
        const newDuration = Math.max(10, textWidth / 40);
        setDuration(newDuration);
      }
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
    <div ref={containerRef} className={`overflow-hidden text-ink ${className}`}>
      <div className={`marquee ${shouldScroll ? 'is-scrolling' : 'is-static'}`}>
        <div 
          className="marquee-content"
          style={{ 
            animationDuration: `${duration}s`,
            animationPlayState: isPlaying ? 'running' : 'paused'
          }}
        >
          <span ref={textRef} className="text-xl font-normal">
            {text}
          </span>
          {shouldScroll && (
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
