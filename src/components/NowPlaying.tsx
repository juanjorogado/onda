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
  const text = useMemo(() => {
    if (title && artist) {
      // Formato: "Nombre de la canción. Nombre del grupo — Álbum (Año)"
      const titleArtist = `${title}. ${artist}`;
      if (album) {
        return year ? `${titleArtist} — ${album} (${year})` : `${titleArtist} — ${album}`;
      }
      return year ? `${titleArtist} (${year})` : titleArtist;
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
  
  const fontSizeClass = fontSize === 'm' ? 'text-m' : 'text-xl';
  
  return (
    <div className={`w-full overflow-hidden text-ink ${className || ''}`}>
      <div className="marquee">
        <span className={`${fontSizeClass} font-normal inline-block whitespace-nowrap`}>{text}</span>
      </div>
    </div>
  );
});

NowPlaying.displayName = 'NowPlaying';
