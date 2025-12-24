import { useEffect, useState } from 'react';
import { Station } from '../types/station';
import { TrackInfo } from '../types/track';
import { searchTrackInfo } from '../services/trackService';

export function useNowPlaying(station?: Station | null) {
  const [track, setTrack] = useState<TrackInfo>({});

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    const fetchNowPlaying = async () => {
      if (!station) {
        setTrack({});
        return;
      }
      try {
        let trackInfo: TrackInfo = { cover: station.cover };
        
        // Intentar obtener información de la estación
        if (station.id.toLowerCase() === 'kexp') {
          const res = await fetch('https://api.kexp.org/v2/plays/?ordering=-airdate&limit=1');
          const data = await res.json();
          const item = data?.results?.[0];
          if (item) {
            const title = item?.song || undefined;
            const artist = item?.artist || undefined;
            const cover = item?.image_uri || item?.thumbnail_uri || undefined;
            const releaseDate = item?.release_date || item?.album_release_date;
            const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;
            
            trackInfo = { title, artist, cover: cover || station.cover, year };
            
            // Si tenemos título y artista, intentar buscar información adicional si falta cover o year
            if (title && artist && (!cover || !year)) {
              const additionalInfo = await searchTrackInfo(artist, title);
              if (additionalInfo) {
                trackInfo = {
                  ...trackInfo,
                  cover: trackInfo.cover || additionalInfo.cover,
                  year: trackInfo.year || additionalInfo.year,
                };
              }
            }
            
            setTrack(trackInfo);
            return;
          }
        }
        
        // Si la estación no proporciona información, intentar buscar usando servicios externos
        // Nota: Sin título/artista de la estación, no podemos buscar. 
        // En el futuro se podría implementar reconocimiento de audio o metadata del stream
        setTrack({ title: undefined, artist: undefined, cover: station.cover });
      } catch {
        setTrack({ title: undefined, artist: undefined, cover: station.cover });
      }
    };

    fetchNowPlaying();
    timer = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(timer);
  }, [station?.id]);

  return track;
}
