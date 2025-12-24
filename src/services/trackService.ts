import { TrackInfo } from '../types/track';

/**
 * Busca información de un track usando Last.fm API
 * @param artist - Nombre del artista
 * @param title - Título de la canción
 * @returns Información del track o undefined
 */
export async function searchTrackLastFM(artist: string, title: string): Promise<TrackInfo | null> {
  try {
    const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
    
    // Si no hay API key, saltar Last.fm y usar solo MusicBrainz
    if (!API_KEY) {
      return null;
    }
    
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.track && !data.error) {
      const track = data.track;
      const year = track.album?.wiki?.published 
        ? new Date(track.album.wiki.published).getFullYear()
        : track.album?.releasedate 
        ? new Date(track.album.releasedate).getFullYear()
        : undefined;
      
      return {
        title: track.name || title,
        artist: track.artist?.name || artist,
        cover: track.album?.image?.find((img: any) => img.size === 'large')?.['#text'] || 
               track.album?.image?.find((img: any) => img.size === 'medium')?.['#text'],
        year,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Busca información de un track usando MusicBrainz API
 * @param artist - Nombre del artista
 * @param title - Título de la canción
 * @returns Información del track o undefined
 */
export async function searchTrackMusicBrainz(artist: string, title: string): Promise<TrackInfo | null> {
  try {
    // Primero buscar el artista
    const artistUrl = `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(artist)}&limit=1&fmt=json`;
    const artistResponse = await fetch(artistUrl, {
      headers: {
        'User-Agent': 'ONDA Radio App/1.0 (https://github.com/juanjorogado/onda)',
      },
    });
    
    if (!artistResponse.ok) return null;
    const artistData = await artistResponse.json();
    if (!artistData.artists || artistData.artists.length === 0) return null;
    
    const artistId = artistData.artists[0].id;
    
    // Buscar el track
    const trackUrl = `https://musicbrainz.org/ws/2/recording/?query=artist:${artistId} AND recording:${encodeURIComponent(title)}&limit=1&fmt=json`;
    const trackResponse = await fetch(trackUrl, {
      headers: {
        'User-Agent': 'ONDA Radio App/1.0 (https://github.com/juanjorogado/onda)',
      },
    });
    
    if (!trackResponse.ok) return null;
    const trackData = await trackResponse.json();
    if (!trackData.recordings || trackData.recordings.length === 0) return null;
    
    const recording = trackData.recordings[0];
    
    // Buscar releases para obtener el año
    const releaseUrl = `https://musicbrainz.org/ws/2/recording/${recording.id}?inc=releases&fmt=json`;
    const releaseResponse = await fetch(releaseUrl, {
      headers: {
        'User-Agent': 'ONDA Radio App/1.0 (https://github.com/juanjorogado/onda)',
      },
    });
    
    let year: number | undefined;
    if (releaseResponse.ok) {
      const releaseData = await releaseResponse.json();
      if (releaseData.releases && releaseData.releases.length > 0) {
        const release = releaseData.releases[0];
        if (release.date) {
          year = new Date(release.date).getFullYear();
        }
      }
    }
    
    return {
      title: recording.title || title,
      artist: artist,
      year,
    };
  } catch {
    return null;
  }
}

/**
 * Busca información de un track usando múltiples servicios como fallback
 * @param artist - Nombre del artista
 * @param title - Título de la canción
 * @returns Información del track o null
 */
export async function searchTrackInfo(artist: string, title: string): Promise<TrackInfo | null> {
  if (!artist || !title) return null;
  
  // Intentar Last.fm primero (más rápido y con covers)
  const lastFMResult = await searchTrackLastFM(artist, title);
  if (lastFMResult) return lastFMResult;
  
  // Si Last.fm falla, intentar MusicBrainz
  const musicBrainzResult = await searchTrackMusicBrainz(artist, title);
  if (musicBrainzResult) return musicBrainzResult;
  
  return null;
}


