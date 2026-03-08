import { TrackInfo } from '../types/track';
import { safeFetch } from '../utils/fetchWithTimeout';

// Headers comunes para requests a MusicBrainz
const MUSICBRAINZ_HEADERS = {
  'User-Agent': 'ONDA Radio App/1.0',
};

// Timeouts específicos por servicio (ms)
const TIMEOUTS = {
  musicbrainz: 8000,
  lastfm: 5000,
  itunes: 5000,
  coverartarchive: 8000,
};

// Tipos para MusicBrainz
interface MusicBrainzRecording {
  id: string;
  title: string;
}

interface MusicBrainzRecordingResponse {
  recordings?: MusicBrainzRecording[];
}

interface MusicBrainzRelease {
  id: string;
  date?: string;
}

interface MusicBrainzReleaseResponse {
  releases?: MusicBrainzRelease[];
}

interface MusicBrainzArtist {
  id: string;
}

interface MusicBrainzArtistResponse {
  artists?: MusicBrainzArtist[];
}

// Tipos para Last.fm
interface LastFmImage {
  size: string;
  '#text': string;
}

interface LastFmAlbum {
  title?: string;
  wiki?: { published?: string };
  releasedate?: string;
  image?: LastFmImage[];
}

interface LastFmArtist {
  name?: string;
}

interface LastFmTrack {
  name?: string;
  artist?: LastFmArtist;
  album?: LastFmAlbum;
}

interface LastFmResponse {
  track?: LastFmTrack;
  error?: number;
}

// Tipos para Apple Music/iTunes
interface iTunesResult {
  artworkUrl100?: string;
}

interface iTunesResponse {
  results?: iTunesResult[];
}

// Tipos para Cover Art Archive
interface CoverArtImage {
  front?: boolean;
  image?: string;
  thumbnails?: { large?: string };
}

interface CoverArtResponse {
  images?: CoverArtImage[];
}

/**
 * Busca un recording en MusicBrainz
 */
async function findRecording(query: string): Promise<MusicBrainzRecording | null> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://musicbrainz.org/ws/2/recording/?query=${encodedQuery}&limit=1&fmt=json`;
  const data = await safeFetch<MusicBrainzRecordingResponse>(url, { 
    headers: MUSICBRAINZ_HEADERS,
    timeout: TIMEOUTS.musicbrainz,
  });

  if (!data?.recordings || data.recordings.length === 0) return null;
  return data.recordings[0];
}

/**
 * Obtiene los releases de un recording desde MusicBrainz
 */
async function getRecordingReleases(recordingId: string): Promise<MusicBrainzRelease[] | null> {
  const url = `https://musicbrainz.org/ws/2/recording/${recordingId}?inc=releases&fmt=json`;
  const data = await safeFetch<MusicBrainzReleaseResponse>(url, { 
    headers: MUSICBRAINZ_HEADERS,
    timeout: TIMEOUTS.musicbrainz,
  });

  return data?.releases && data.releases.length > 0 ? data.releases : null;
}

/**
 * Busca un artista en MusicBrainz y retorna su ID
 */
async function findArtistId(artist: string): Promise<string | null> {
  const artistUrl = `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(artist)}&limit=1&fmt=json`;
  const artistData = await safeFetch<MusicBrainzArtistResponse>(artistUrl, { 
    headers: MUSICBRAINZ_HEADERS,
    timeout: TIMEOUTS.musicbrainz,
  });

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
): Promise<{ recording: MusicBrainzRecording; releases: MusicBrainzRelease[] } | null> {
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
  const data = await safeFetch<LastFmResponse>(url, { timeout: TIMEOUTS.lastfm });

  // Verificar que no haya error en la respuesta
  if (!data?.track || data.error) return null;

  const track = data.track;

  const year = track.album?.wiki?.published
    ? new Date(track.album.wiki.published).getFullYear()
    : track.album?.releasedate
    ? new Date(track.album.releasedate).getFullYear()
    : undefined;

  const cover = track.album?.image?.find((img) => img.size === 'large')?.['#text'] ||
                track.album?.image?.find((img) => img.size === 'medium')?.['#text'] ||
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
  const data = await safeFetch<iTunesResponse>(url, { timeout: TIMEOUTS.itunes });

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
  const coverArtData = await safeFetch<CoverArtResponse>(coverArtUrl, { timeout: TIMEOUTS.coverartarchive });

  if (!coverArtData?.images || coverArtData.images.length === 0) return null;

  const frontImage = coverArtData.images.find((img) => img.front) || coverArtData.images[0];
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


