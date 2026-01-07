import { memo, useMemo } from 'react';

interface NowPlayingProps {
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  stationName?: string;
  className?: string;
}

// Separador para el marquee (4 espacios no separables)
const MARQUEE_SEPARATOR = '\u00A0\u00A0\u00A0\u00A0';

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
  return stationName ? `Sonando la radio ${stationName}` : '';
};

export const NowPlaying = memo(({ 
  title, 
  artist, 
  album, 
  year, 
  stationName, 
  className = '' 
}: NowPlayingProps) => {
  const text = useMemo(
    () => formatTrackInfo(title, artist, album, year, stationName),
    [title, artist, album, year, stationName]
  );
  
  if (!text) return null;
  
  // Duplicar el texto para el efecto continuo del marquee
  const marqueeText = `${text}${MARQUEE_SEPARATOR}${text}`;
  
  return (
    <div className={`overflow-hidden text-ink ${className}`}>
      <div className="marquee">
        <span className="text-xl font-normal">
          {marqueeText}
        </span>
      </div>
    </div>
  );
});

NowPlaying.displayName = 'NowPlaying';
