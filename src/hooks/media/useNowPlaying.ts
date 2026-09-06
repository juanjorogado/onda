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

  // Providers genéricos para estaciones sin API específica
  'wfmu-fixed': DEFAULT_PROVIDER_CONFIG,
  'tsf-jazz': DEFAULT_PROVIDER_CONFIG,
  'cashmere-radio': DEFAULT_PROVIDER_CONFIG,
  'radio-raheem': DEFAULT_PROVIDER_CONFIG,
  'bbc-6music': DEFAULT_PROVIDER_CONFIG,
  'fip': DEFAULT_PROVIDER_CONFIG,
  'france-musique': DEFAULT_PROVIDER_CONFIG,
  'nts-radio': DEFAULT_PROVIDER_CONFIG,
  'nts-2': DEFAULT_PROVIDER_CONFIG,
  'whisperings-piano': DEFAULT_PROVIDER_CONFIG,
  'fluxfm': DEFAULT_PROVIDER_CONFIG,
  'fluxfm-neofm': DEFAULT_PROVIDER_CONFIG,
  'fluxfm-cosmic': DEFAULT_PROVIDER_CONFIG,
  'fluxfm-xjazz': DEFAULT_PROVIDER_CONFIG,
  'radio-eins': DEFAULT_PROVIDER_CONFIG,
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
        genre: trackInfo.genre || additionalInfo.genre,
        apple_music_url: trackInfo.apple_music_url || additionalInfo.apple_music_url,
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


export function useNowPlaying(station?: Station | null) {
  const [track, setTrack] = useState<TrackInfo>({});
  const trackRef = useRef<TrackInfo>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stationIdRef = useRef<string | null>(null);

  useEffect(() => {
    trackRef.current = track;
  }, [track]);

  const updateTrack = useCallback(async (newTrack: TrackInfo & { duration_ms?: number, offset_ms?: number }): Promise<TrackInfo> => {
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

    let enriched: TrackInfo = { ...newTrack };

    if (newTrack.title && newTrack.artist) {
      try {
        const fullInfo = await searchTrackInfo(newTrack.artist, newTrack.title);
        if (fullInfo) {
          enriched = {
            ...enriched,
            cover: enriched.cover || fullInfo.cover,
            album: enriched.album || fullInfo.album,
            year: enriched.year || fullInfo.year,
            genre: enriched.genre || fullInfo.genre,
            apple_music_url: enriched.apple_music_url || fullInfo.apple_music_url,
          };
          setTrack(prev => ({ ...prev, ...enriched }));
        }
      } catch (e) {
        console.warn('Could not find cover art for identified track:', e);
      }
    }

    return enriched;
  }, []);

  const fetchNowPlaying = useCallback(async (isPolling = false) => {
    if (!station) {
      setTrack({});
      return;
    }

    // During polling, don't overwrite a manually-identified track unless the
    // provider returns a different song (title changed), which means a new track started.
    const latest = trackRef.current;
    const hasManualTrack = isPolling && latest.title && latest.artist;

    // Si la estación cambia, LIMPIAR el track identificado manualmente
    if (stationIdRef.current !== station.id) {
      setTrack({});
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

      if (trackInfo?.title) {
        // If we have a manual track and the provider returns the same song, skip update
        if (hasManualTrack && trackInfo.title === latest.title && trackInfo.artist === latest.artist) {
          return;
        }
        // New track from provider — enrich it before setting
        await updateTrack(trackInfo);
      } else if (!hasManualTrack) {
        // No provider result and no manual track — clear
        setTrack({});
      }
      // If hasManualTrack and provider returned nothing, keep the manual track as-is
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      if (!signal.aborted && stationIdRef.current === station.id && !hasManualTrack) {
        setTrack({});
      }
    }
  }, [station, updateTrack]);

  // Initial fetch and polling
  useEffect(() => {
    // Clean up previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset station tracking and clear previous track immediately
    stationIdRef.current = station?.id || null;
    setTrack({});

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
