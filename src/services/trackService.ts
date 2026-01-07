import { TrackInfo } from '../types/track';

// Headers comunes para requests a MusicBrainz
const MUSICBRAINZ_HEADERS = {
  'User-Agent': 'ONDA Radio App/1.0',
};

/**
 * Helper para hacer fetch con manejo de errores unificado
 */
async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Busca un recording en MusicBrainz
 */
async function findRecording(query: string): Promise<any | null> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://musicbrainz.org/ws/2/recording/?query=${encodedQuery}&limit=1&fmt=json`;
  const data = await safeFetch<any>(url, { headers: MUSICBRAINZ_HEADERS });
  
  if (!data?.recordings || data.recordings.length === 0) return null;
  return data.recordings[0];
}

/**
 * Obtiene los releases de un recording desde MusicBrainz
 */
async function getRecordingReleases(recordingId: string): Promise<any[] | null> {
  const url = `https://musicbrainz.org/ws/2/recording/${recordingId}?inc=releases&fmt=json`;
  const data = await safeFetch<any>(url, { headers: MUSICBRAINZ_HEADERS });
  
  return data?.releases && data.releases.length > 0 ? data.releases : null;
}

/**
 * Busca un artista en MusicBrainz y retorna su ID
 */
async function findArtistId(artist: string): Promise<string | null> {
  const artistUrl = `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(artist)}&limit=1&fmt=json`;
  const artistData = await safeFetch<any>(artistUrl, { headers: MUSICBRAINZ_HEADERS });
  
  if (!artistData?.artists || artistData.artists.length === 0) return null;
  return artistData.artists[0].id;
}

/**
 * Busca un recording y sus releases para un artista y título
 */
async function findRecordingWithReleases(
  artistId: string | null,
  artist: string,
  title: string
): Promise<{ recording: any; releases: any[] } | null> {
  const finalArtistId = artistId || await findArtistId(artist);
  if (!finalArtistId) return null;
  
  const recording = await findRecording(`artist:${finalArtistId} AND recording:${title}`);
  if (!recording) return null;
  
  const releases = await getRecordingReleases(recording.id);
  if (!releases || releases.length === 0) return null;
  
  return { recording, releases };
}

/**
 * Busca información de un track usando Last.fm API
 */
export async function searchTrackLastFM(artist: string, title: string): Promise<TrackInfo | null> {
  const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
  
  // Si no hay API key, saltar Last.fm
  if (!API_KEY) return null;
  
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&format=json`;
  const data = await safeFetch<any>(url);
  
  // Verificar que no haya error en la respuesta
  if (!data?.track || data.error) return null;
  
  const track = data.track;
  
  const year = track.album?.wiki?.published 
    ? new Date(track.album.wiki.published).getFullYear()
    : track.album?.releasedate 
    ? new Date(track.album.releasedate).getFullYear()
    : undefined;
  
  const cover = track.album?.image?.find((img: any) => img.size === 'large')?.['#text'] || 
                track.album?.image?.find((img: any) => img.size === 'medium')?.['#text'] ||
                undefined;
  
  return {
    title: track.name || title,
    artist: track.artist?.name || artist,
    album: track.album?.title,
    cover,
    year,
  };
}

/**
 * Busca información de un track usando MusicBrainz API
 */
export async function searchTrackMusicBrainz(artist: string, title: string): Promise<TrackInfo | null> {
  const result = await findRecordingWithReleases(null, artist, title);
  if (!result) return null;
  
  const { recording, releases } = result;
  
  const year = releases[0]?.date ? new Date(releases[0].date).getFullYear() : undefined;
  
  return {
    title: recording.title || title,
    artist: artist,
    year,
  };
}

/**
 * Busca el cover de un track usando Apple Music API (iTunes Search)
 */
async function searchTrackAppleMusic(artist: string, title: string): Promise<string | null> {
  const query = `${encodeURIComponent(artist)} ${encodeURIComponent(title)}`;
  const url = `https://itunes.apple.com/search?term=${query}&media=music&limit=1`;
  const data = await safeFetch<any>(url);
  
  if (!data?.results || data.results.length === 0) return null;
  
  const track = data.results[0];
  return track.artworkUrl100?.replace('100x100', '600x600') || track.artworkUrl100 || null;
}

/**
 * Busca el cover de un track usando MusicBrainz con Cover Art Archive
 */
async function searchTrackCoverArt(artist: string, title: string): Promise<string | null> {
  const result = await findRecordingWithReleases(null, artist, title);
  if (!result) return null;
  
  const coverArtUrl = `https://coverartarchive.org/release/${result.releases[0].id}`;
  const coverArtData = await safeFetch<any>(coverArtUrl);
  
  if (!coverArtData?.images || coverArtData.images.length === 0) return null;
  
  const frontImage = coverArtData.images.find((img: any) => img.front) || coverArtData.images[0];
  return frontImage?.image || frontImage?.thumbnails?.large || null;
}

/**
 * Construye un objeto TrackInfo con los datos proporcionados
 */
function buildTrackInfo(
  title: string,
  artist: string,
  cover?: string,
  year?: number,
  album?: string
): TrackInfo {
  return {
    title,
    artist,
    ...(cover && { cover }),
    ...(year && { year }),
    ...(album && { album }),
  };
}

/**
 * Busca información de un track usando múltiples servicios como fallback.
 * Prioriza obtener el cover de la canción.
 */
export async function searchTrackInfo(artist: string, title: string): Promise<TrackInfo | null> {
  if (!artist || !title) return null;
  
  const lastFMResult = await searchTrackLastFM(artist, title);
  if (lastFMResult?.cover) return lastFMResult;
  
  const appleMusicCover = await searchTrackAppleMusic(artist, title);
  if (appleMusicCover) {
    return buildTrackInfo(title, artist, appleMusicCover, lastFMResult?.year, lastFMResult?.album);
  }
  
  const coverArtCover = await searchTrackCoverArt(artist, title);
  if (coverArtCover) {
    return buildTrackInfo(title, artist, coverArtCover, lastFMResult?.year, lastFMResult?.album);
  }
  
  const musicBrainzResult = await searchTrackMusicBrainz(artist, title);
  if (musicBrainzResult) {
    return buildTrackInfo(
      musicBrainzResult.title || title,
      musicBrainzResult.artist || artist,
      lastFMResult?.cover,
      musicBrainzResult.year,
      lastFMResult?.album
    );
  }
  
  return lastFMResult;
}


