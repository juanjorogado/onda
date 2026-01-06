import { useEffect, useState, useRef, useCallback } from 'react';
import { Station } from '../types/station';
import { TrackInfo } from '../types/track';
import { searchTrackInfo } from '../services/trackService';
import { POLLING_INTERVAL, API_ENDPOINTS } from '../constants';

export function useNowPlaying(station?: Station | null) {
  const [track, setTrack] = useState<TrackInfo>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    if (!station) {
      setTrack({});
      return;
    }

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController para esta petición
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      let trackInfo: TrackInfo = {};
      
      // Intentar obtener información de la estación
      if (station.id.toLowerCase() === 'kexp') {
        const res = await fetch(API_ENDPOINTS.KEXP, {
          signal,
          // Agregar headers para mejor caching
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (signal.aborted) return;
        
        const data = await res.json();
        const item = data?.results?.[0];
        if (item) {
          const title = item?.song || undefined;
          const artist = item?.artist || undefined;
          const album = item?.album || undefined;
          const cover = item?.image_uri || item?.thumbnail_uri || undefined;
          const releaseDate = item?.release_date || item?.album_release_date;
          const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;
          
          trackInfo = { title, artist, album, cover, year };
          
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
          
          if (!signal.aborted) {
            setTrack(trackInfo);
          }
          return;
        }
      }
      
      // Para otras estaciones, si tenemos información de track de alguna fuente
      // (por ejemplo, si en el futuro se agrega metadata del stream o reconocimiento de audio),
      // buscar el cover del álbum
      // Por ahora, solo tenemos información de track para KEXP
      // Pero si en el futuro se obtiene información de otras fuentes, aquí se buscaría el cover
      
      // Si no hay información de track, usar el cover de la estación como fallback
      if (!signal.aborted) {
        setTrack({ 
          title: undefined, 
          artist: undefined, 
          album: undefined,
          cover: station.cover || undefined,
          year: undefined
        });
      }
    } catch (error) {
      // Ignorar errores de abort
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      // Solo actualizar si no fue abortado
      if (!signal.aborted) {
        setTrack({ title: undefined, artist: undefined, cover: station.cover });
      }
    }
  }, [station]);

  useEffect(() => {
    // Limpiar intervalos y peticiones anteriores
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Ejecutar inmediatamente
    fetchNowPlaying();

    // Configurar polling cada 30 segundos
    intervalRef.current = setInterval(fetchNowPlaying, POLLING_INTERVAL);

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

  return track;
}
