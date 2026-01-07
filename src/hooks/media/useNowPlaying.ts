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
 * Mapa de providers por estación
 * Fácil de extender agregando nuevas estaciones
 */
const STATION_PROVIDERS: Record<string, StationProvider> = {
  kexp: kexpProvider,
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
