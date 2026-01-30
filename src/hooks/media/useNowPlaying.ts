import { useEffect, useState, useRef, useCallback } from 'react';
import { Station } from '../../types/station';
import { TrackInfo } from '../../types/track';
import { searchTrackInfo } from '../../services/trackService';
import { POLLING_INTERVAL, API_ENDPOINTS } from '../../constants';

type StationProvider = (station: Station, signal: AbortSignal) => Promise<TrackInfo | null>;

/**
 * Provider para KEXP: obtiene información de track desde su API
 */
async function kexpProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  const response = await fetch(API_ENDPOINTS.KEXP, {
    signal,
    headers: { 'Accept': 'application/json' },
  });

  if (signal.aborted) return null;

  const data = await response.json();
  const item = data?.results?.[0];
  if (!item) return null;

  const title = item?.song || undefined;
  const artist = item?.artist || undefined;
  const album = item?.album || undefined;
  const cover = item?.image_uri || item?.thumbnail_uri || undefined;
  const releaseDate = item?.release_date || item?.album_release_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;

  let trackInfo: TrackInfo = { title, artist, album, cover, year };

  // Si tenemos título y artista pero no cover, buscar en servicios externos
  if (title && artist && !cover && !signal.aborted) {
    const additionalInfo = await searchTrackInfo(artist, title);
    if (additionalInfo && !signal.aborted) {
      trackInfo = {
        ...trackInfo,
        album: trackInfo.album || additionalInfo.album,
        cover: trackInfo.cover || additionalInfo.cover,
        year: trackInfo.year || additionalInfo.year,
      };
    }
  }

  return signal.aborted ? null : trackInfo;
}

/**
 * Provider genérico para estaciones con metadata en stream Icecast/Shoutcast
 * Intenta extraer metadata del stream de audio
 */
async function icecastMetadataProvider(station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  try {
    // Intentar obtener metadata del stream usando CORS proxy o directamente
    const streamUrl = station.url;
    const isShoutcast = streamUrl.includes('shoutcast') || streamUrl.includes(':8');

    if (isShoutcast) {
      // Intentar obtener metadata de Shoutcast
      const statsUrl = streamUrl.replace(/\.mp3$|\.aac$/, '') + '/stats';
      try {
        const response = await fetch(statsUrl, {
          signal,
          headers: { 'Accept': 'application/json' },
        });

        if (!signal.aborted && response.ok) {
          const data = await response.json();
          const title = data?.currentTrack || data?.title || data?.song || undefined;
          if (title) {
            // Parsear "Artist - Title"
            const parts = title.split(' - ');
            if (parts.length >= 2) {
              return {
                artist: parts[0].trim(),
                title: parts[1].trim(),
              };
            }
            return { title };
          }
        }
      } catch {
        // Fallback silencioso
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Provider para OTTAVA (Japón) - Radio clásica/contemporánea
 * Intenta obtener metadata desde la web oficial
 */
async function ottavaProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  try {
    const response = await fetch('https://ottava.jp/api/nowplaying', {
      signal,
      headers: { 'Accept': 'application/json' },
    });

    if (signal.aborted) return null;
    if (!response.ok) return null;

    const data = await response.json();
    return {
      title: data?.title || undefined,
      artist: data?.artist || undefined,
      album: data?.album || undefined,
      cover: data?.cover || data?.image || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Provider para Dublab - Usa su API pública
 */
async function dublabProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  try {
    const response = await fetch('https://www.dublab.com/api/nowplaying', {
      signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ONDA Radio App/1.0',
      },
    });

    if (signal.aborted) return null;
    if (!response.ok) return null;

    const data = await response.json();
    return {
      title: data?.track?.title || data?.title || undefined,
      artist: data?.track?.artist || data?.artist || undefined,
      album: data?.track?.album || data?.album || undefined,
      cover: data?.track?.artwork || data?.artwork || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Provider para Radio Nova (Francia)
 */
async function radioNovaProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  try {
    const response = await fetch('https://www.novaplanet.com/radio/nowplaying', {
      signal,
      headers: { 'Accept': 'application/json' },
    });

    if (signal.aborted) return null;
    if (!response.ok) return null;

    const data = await response.json();
    return {
      title: data?.currentTrack?.title || undefined,
      artist: data?.currentTrack?.artist || undefined,
      album: data?.currentTrack?.album || undefined,
      cover: data?.currentTrack?.cover || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Provider para TSF Jazz (Francia)
 */
async function tsfJazzProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  try {
    const response = await fetch('https://www.tsfjazz.com/api/nowplaying', {
      signal,
      headers: { 'Accept': 'application/json' },
    });

    if (signal.aborted) return null;
    if (!response.ok) return null;

    const data = await response.json();
    return {
      title: data?.title || undefined,
      artist: data?.artist || undefined,
      album: data?.album || undefined,
      cover: data?.cover || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Provider para Worldwide FM (Londres)
 */
async function worldwideFmProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  try {
    const response = await fetch('https://worldwidefm.net/api/nowplaying', {
      signal,
      headers: { 'Accept': 'application/json' },
    });

    if (signal.aborted) return null;
    if (!response.ok) return null;

    const data = await response.json();
    return {
      title: data?.track?.title || data?.title || undefined,
      artist: data?.track?.artist || data?.artist || undefined,
      album: data?.track?.album || data?.album || undefined,
      cover: data?.track?.artwork || data?.artwork || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Provider para WFMU
 */
async function wfmuProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  try {
    const response = await fetch('https://wfmu.org/wp-content/themes/wfmu-theme/ajax/now-playing.php', {
      signal,
      headers: { 'Accept': 'application/json' },
    });

    if (signal.aborted) return null;
    if (!response.ok) return null;

    const data = await response.json();
    return {
      title: data?.song || data?.title || undefined,
      artist: data?.artist || undefined,
      album: data?.album || undefined,
      cover: data?.image || undefined,
    };
  } catch {
    return null;
  }
}



/**
 * Mapa de providers por estación
 * Fácil de extender agregando nuevas estaciones
 */
const STATION_PROVIDERS: Record<string, StationProvider> = {
  // Estaciones con APIs específicas
  kexp: kexpProvider,
  wfmu: wfmuProvider,
  dublab: dublabProvider,
  'radio-nova': radioNovaProvider,
  'tsf-jazz': tsfJazzProvider,
  'worldwide-fm': worldwideFmProvider,
  ottava: ottavaProvider,

  // Providers genéricos para estaciones sin API específica
  'jazz-sakura': icecastMetadataProvider,
  'radio-relativa': icecastMetadataProvider,
  'radio-raheem': icecastMetadataProvider,
  'calm-neoclassical': icecastMetadataProvider,
};

/**
 * Obtiene el provider para una estación o retorna null
 */
function getStationProvider(stationId: string): StationProvider | null {
  return STATION_PROVIDERS[stationId.toLowerCase()] || null;
}

/**
 * Helper para limpiar recursos (interval y abort controller)
 */
function cleanupResources(
  intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
  abortControllerRef: React.MutableRefObject<AbortController | null>
) {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
    abortControllerRef.current = null;
  }
}

export function useNowPlaying(station?: Station | null) {
  const [track, setTrack] = useState<TrackInfo>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    if (!station) {
      setTrack({});
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const provider = getStationProvider(station.id);
      const trackInfo = provider 
        ? await provider(station, signal)
        : null;

      if (signal.aborted) return;

      if (trackInfo) {
        setTrack(trackInfo);
      } else {
        // Fallback: usar cover de la estación
        setTrack({ cover: station.cover || undefined });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      if (!signal.aborted) {
        setTrack({ cover: station.cover || undefined });
      }
    }
  }, [station]);

  useEffect(() => {
    cleanupResources(intervalRef, abortControllerRef);
    fetchNowPlaying();
    intervalRef.current = setInterval(fetchNowPlaying, POLLING_INTERVAL);

    return () => cleanupResources(intervalRef, abortControllerRef);
  }, [station?.id, fetchNowPlaying]);

  return track;
}
