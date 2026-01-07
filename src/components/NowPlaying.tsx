import { memo, useMemo } from 'react';

interface NowPlayingProps {
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  stationName?: string;
  className?: string;
  fontSize?: 'm' | 'xl';
}

export const NowPlaying = memo(({ title, artist, album, year, stationName, className, fontSize = 'xl' }: NowPlayingProps) => {
  const fontSizeClass = fontSize === 'm' ? 'text-m' : 'text-xl';
  
  const text = useMemo(() => {
    if (title && artist) {
      // Formato: "Nombre de la canción. Nombre del grupo — Álbum (Año)"
      const albumYear = album ? (year ? ` — ${album} (${year})` : ` — ${album}`) : (year ? ` (${year})` : '');
      return `${title}. ${artist}${albumYear}`;
    } else if (title) {
      // Solo título
      if (album) {
        return year ? `${title} — ${album} (${year})` : `${title} — ${album}`;
      }
      return year ? `${title} (${year})` : title;
    } else if (artist) {
      // Solo artista
      if (album) {
        return year ? `${artist} — ${album} (${year})` : `${artist} — ${album}`;
      }
      return year ? `${artist} (${year})` : artist;
    } else if (stationName) {
      return `Sonando la radio ${stationName}`;
    }
    return '';
  }, [title, artist, album, year, stationName]);
  
  if (!text) return null;
  
  // Duplicar el texto para el efecto continuo del marquee
  const marqueeText = `${text} — ${text}`;
  
  return (
    <div className={`w-full overflow-hidden text-ink ${className || ''}`}>
      <div className="marquee">
        <span className={`${fontSizeClass} font-normal inline-block whitespace-nowrap`}>
          {marqueeText}
        </span>
      </div>
    </div>
  );
});

NowPlaying.displayName = 'NowPlaying';
