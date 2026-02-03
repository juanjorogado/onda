import { memo, useMemo, useRef, useEffect, useState } from 'react';

interface NowPlayingProps {
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  stationName?: string;
  className?: string;
}

// Separador para el marquee (espacios entre repeticiones)
const MARQUEE_SEPARATOR = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'; // 20 espacios no separables

/**
 * Formatea la información del track según el formato:
 * "Nombre de la canción. Nombre del grupo — Álbum (Año)"
 */
const formatTrackInfo = (
  title?: string,
  artist?: string,
  album?: string,
  year?: number,
  stationName?: string
): string => {
  // Caso principal: título + artista
  if (title && artist) {
    const parts = [title, artist];
    
    if (album && year) {
      parts.push(`${album} (${year})`);
    } else if (album) {
      parts.push(album);
    } else if (year) {
      parts.push(`(${year})`);
    }
    
    // Formato: "Título. Artista — Álbum (Año)"
    return parts.length === 2 
      ? `${parts[0]}. ${parts[1]}`
      : `${parts[0]}. ${parts[1]} — ${parts[2]}`;
  }
  
  // Solo título o solo artista
  const mainText = title || artist;
  if (mainText) {
    const metadata = [];
    if (album) metadata.push(album);
    if (year) metadata.push(`(${year})`);
    
    return metadata.length > 0 
      ? `${mainText} — ${metadata.join(' ')}`
      : mainText;
  }
  
  // Fallback: nombre de la estación
  return stationName ? `Sonando ${stationName}` : '';
};

export const NowPlaying = memo(({ 
  title, 
  artist, 
  album, 
  year, 
  stationName, 
  className = '' 
}: NowPlayingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(true);
  
  const text = useMemo(
    () => formatTrackInfo(title, artist, album, year, stationName),
    [title, artist, album, year, stationName]
  );
  
  // Detectar si el texto es más ancho que el contenedor
  useEffect(() => {
    if (!containerRef.current || !text) return;
    
    const container = containerRef.current;
    const span = container.querySelector('span');
    
    if (span) {
      // Comparar el ancho del texto con el ancho del contenedor
      // Dividimos por 2 porque el texto está duplicado
      const textWidth = span.scrollWidth / 2;
      const containerWidth = container.offsetWidth;
      
      // Solo hacer scroll si el texto es significativamente más ancho que el contenedor
      // Añadimos un margen de 20px para evitar scroll innecesario en textos que casi caben
      setShouldScroll(textWidth > containerWidth + 20);
    }
  }, [text]);
  
  if (!text) return null;
  
  // Duplicar el texto con espacios para el efecto continuo del marquee
  const marqueeText = `${text}${MARQUEE_SEPARATOR}${text}${MARQUEE_SEPARATOR}`;
  
  return (
    <div ref={containerRef} className={`overflow-hidden text-ink ${className}`}>
      <div className="marquee">
        <span 
          className={`text-xl font-normal ${!shouldScroll ? 'marquee-paused' : ''}`}
          style={{ ['--marquee-play-state' as string]: shouldScroll ? 'running' : 'paused' }}
        >
          {marqueeText}
        </span>
      </div>
    </div>
  );
});

NowPlaying.displayName = 'NowPlaying';
