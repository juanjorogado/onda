import { useEffect, useState, useRef, useCallback } from 'react';
import { Station } from '../../types/station';
import { TrackInfo } from '../../types/track';
import { searchTrackInfo } from '../../services/trackService';
import { POLLING_INTERVAL, API_ENDPOINTS, PROVIDER_TIMEOUT, SHOUTCAST_TIMEOUT } from '../../constants';
import { fetchWithTimeout } from '../../utils/fetchWithTimeout';

type StationProvider = (station: Station, signal: AbortSignal) => Promise<TrackInfo | null>;

// Configuración de providers - fácil de extender
interface ProviderConfig {
  provider: StationProvider;
  timeout?: number;
  enableExternalLookup?: boolean;
}

const DEFAULT_PROVIDER_CONFIG: ProviderConfig = {
  provider: icecastMetadataProvider,
  timeout: SHOUTCAST_TIMEOUT,
  enableExternalLookup: true,
};

// Mapa de configuración de providers
const STATION_PROVIDERS: Record<string, ProviderConfig> = {
  // Estaciones con APIs específicas
  kexp: { provider: kexpProvider, timeout: PROVIDER_TIMEOUT },
  wfmu: { provider: wfmuProvider, timeout: PROVIDER_TIMEOUT },
  'tsf-jazz': { provider: tsfJazzProvider, timeout: PROVIDER_TIMEOUT },

  // Providers genéricos para estaciones sin API específica
  'cashmere-radio': DEFAULT_PROVIDER_CONFIG,
  'radio-raheem': DEFAULT_PROVIDER_CONFIG,
  'bbc-6music': DEFAULT_PROVIDER_CONFIG,
  'resonance-fm': DEFAULT_PROVIDER_CONFIG,
  'fip': DEFAULT_PROVIDER_CONFIG,
  'france-musique': DEFAULT_PROVIDER_CONFIG,
  'radio-paradise': DEFAULT_PROVIDER_CONFIG,
  'nts-radio': DEFAULT_PROVIDER_CONFIG,
  'nts-2': DEFAULT_PROVIDER_CONFIG,
  'whisperings-piano': DEFAULT_PROVIDER_CONFIG,
};

/**
 * Obtiene el provider para una estación o retorna null
 */
function getStationProvider(stationId: string): StationProvider | null {
  const config = STATION_PROVIDERS[stationId.toLowerCase()];
  return config?.provider || null;
}

/**
 * Provider para KEXP: obtiene información de track desde su API
 */
async function kexpProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  const response = await fetchWithTimeout(API_ENDPOINTS.KEXP, {
    signal,
    headers: { 'Accept': 'application/json' },
    timeout: PROVIDER_TIMEOUT,
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
        const response = await fetchWithTimeout(statsUrl, {
          signal,
          headers: { 'Accept': 'application/json' },
          timeout: 5000,
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
 * Provider para TSF Jazz (Francia)
 */
async function tsfJazzProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  try {
    const response = await fetchWithTimeout('https://www.tsfjazz.com/api/nowplaying', {
      signal,
      headers: { 'Accept': 'application/json' },
      timeout: PROVIDER_TIMEOUT,
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
 * Provider para WFMU
 */
async function wfmuProvider(_station: Station, signal: AbortSignal): Promise<TrackInfo | null> {
  try {
    const response = await fetchWithTimeout('https://wfmu.org/wp-content/themes/wfmu-theme/ajax/now-playing.php', {
      signal,
      headers: { 'Accept': 'application/json' },
      timeout: PROVIDER_TIMEOUT,
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

export function useNowPlaying(station?: Station | null) {
  const [track, setTrack] = useState<TrackInfo>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stationIdRef = useRef<string | null>(null);

  const updateTrack = useCallback(async (newTrack: TrackInfo & { duration_ms?: number, offset_ms?: number }) => {
    setTrack(prev => ({ ...prev, ...newTrack }));

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    let resetTime = 5 * 60 * 1000;

    if (newTrack.duration_ms && newTrack.offset_ms !== undefined) {
      const remainingMs = newTrack.duration_ms - newTrack.offset_ms;
      resetTime = Math.max(30000, remainingMs + 15000);
    }

    resetTimeoutRef.current = setTimeout(() => {
      setTrack({});
    }, resetTime);

    if (newTrack.title && newTrack.artist) {
      try {
        const fullInfo = await searchTrackInfo(newTrack.artist, newTrack.title);
        if (fullInfo?.cover) {
          setTrack(prev => ({ 
            ...prev, 
            cover: fullInfo.cover,
            album: prev.album || fullInfo.album,
            year: prev.year || fullInfo.year
          }));
        }
      } catch (e) {
        console.warn('No se pudo encontrar el cover para el track identificado:', e);
      }
    }
  }, []);

  const fetchNowPlaying = useCallback(async (isPolling = false) => {
    if (!station) {
      setTrack({});
      return;
    }

    // Si tenemos un track identificado manualmente (con título y artista), 
    // y estamos en un polling (no un cambio de estación), NO lo sobreescribimos
    // a menos que el provider encuentre algo nuevo (que no suele ocurrir si ya falló)
    if (isPolling && track.title && track.artist && !getStationProvider(station.id)) {
      return;
    }

    // Si la estación cambia, LIMPIAR el track identificado manualmente
    if (stationIdRef.current !== station.id) {
      setTrack({});
    }

    // Skip if already fetching for this station
    if (stationIdRef.current === station.id && abortControllerRef.current) {
      return;
    }

    stationIdRef.current = station.id;

    // Abort previous request BEFORE starting new one
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

      // Check if this request is still valid (station didn't change)
      if (signal.aborted || stationIdRef.current !== station.id) return;

      if (trackInfo) {
        setTrack(trackInfo);
      } else {
        setTrack({});
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      // Only set empty track if request wasn't aborted and station didn't change
      if (!signal.aborted && stationIdRef.current === station.id) {
        setTrack({});
      }
    }
  }, [station]);

  // Initial fetch and polling
  useEffect(() => {
    // Clean up previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset station tracking for new station
    stationIdRef.current = station?.id || null;

    // Fetch immediately
    fetchNowPlaying(false);

    // Set up polling
    intervalRef.current = setInterval(() => fetchNowPlaying(true), POLLING_INTERVAL);

    // Cleanup on unmount or station change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [station?.id, fetchNowPlaying]);

  return { ...track, updateTrack };
}
