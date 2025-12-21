import { useEffect, useState } from 'react';
import { Station } from '../stations';

export interface TrackInfo {
  title?: string;
  artist?: string;
  cover?: string;
}

export function useNowPlaying(station?: Station | null) {
  const [track, setTrack] = useState<TrackInfo>({});

  useEffect(() => {
    let timer: any;
    const fetchNowPlaying = async () => {
      if (!station) {
        setTrack({});
        return;
      }
      try {
        if (station.id.toLowerCase() === 'kexp') {
          const res = await fetch('https://api.kexp.org/v2/plays/?ordering=-airdate&limit=1');
          const data = await res.json();
          const item = data?.results?.[0];
          if (item) {
            const title = item?.song || undefined;
            const artist = item?.artist || undefined;
            const cover = item?.image_uri || item?.thumbnail_uri || undefined;
            setTrack({ title, artist, cover });
            return;
          }
        }
        setTrack({
          title: undefined,
          artist: undefined,
          cover: station.cover,
        });
      } catch {
        setTrack({
          title: undefined,
          artist: undefined,
          cover: station.cover,
        });
      }
    };

    fetchNowPlaying();
    timer = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(timer);
  }, [station?.id]);

  return track;
}
