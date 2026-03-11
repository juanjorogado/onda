import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

/**
 * Identifica una canción usando ACRCloud capturando un fragmento del stream de audio.
 * Esto evita usar el micrófono del usuario y detener la reproducción local.
 */
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { streamUrl } = request.body;

  if (!streamUrl) {
    return response.status(400).json({ error: 'Missing streamUrl' });
  }

  const accessKey = process.env.ACR_ACCESS_KEY;
  const accessSecret = process.env.ACR_ACCESS_SECRET;
  const host = process.env.ACR_HOST || 'identify-eu-west-1.acrcloud.com';

  if (!accessKey || !accessSecret) {
    return response.status(500).json({ 
      error: 'ACRCloud credentials not configured',
      hint: 'Set ACR_ACCESS_KEY and ACR_ACCESS_SECRET in environment variables'
    });
  }

  try {
    // 1. Capturar un fragmento del stream (aprox 8 segundos)
    const audioData = await captureStreamChunk(streamUrl, 8000);

    if (!audioData || audioData.length === 0) {
      throw new Error('Failed to capture audio from stream');
    }

    // 2. Preparar la petición a ACRCloud
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = buildSignature(
      'POST',
      '/v1/identify',
      accessKey,
      accessSecret,
      'audio',
      '1',
      timestamp
    );

    const formData = new FormData();
    // En Node, Buffer es compatible con BlobPart pero TS puede quejarse
    // Usamos Uint8Array que es lo que devuelve captureStreamChunk
    formData.append('sample', new Blob([audioData]));
    formData.append('access_key', accessKey);
    formData.append('data_type', 'audio');
    formData.append('signature_version', '1');
    formData.append('signature', signature);
    formData.append('sample_bytes', audioData.length.toString());
    formData.append('timestamp', timestamp.toString());

    // 3. Enviar a ACRCloud
    const acrResponse = await fetch(`https://${host}/v1/identify`, {
      method: 'POST',
      body: formData,
    });

    const result: any = await acrResponse.json();

    // 4. Procesar y retornar resultado simplificado
    if (result.status?.code === 0 && result.metadata?.music?.[0]) {
      const music = result.metadata.music[0];
      
      // Intentar obtener el cover de ACRCloud si está disponible
      // ACRCloud suele devolver metadatos externos en music.external_metadata
      const appleMusic = music.external_metadata?.apple_music;
      const spotify = music.external_metadata?.spotify;
      
      // ACRCloud devuelve release_date (ej: "2023-01-15"), extraer año
      const releaseDate = music.release_date;
      const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;
      
      return response.status(200).json({
        success: true,
        track: {
          title: music.title,
          artist: music.artists?.[0]?.name,
          album: music.album?.name,
          year,
          label: music.label,
          release_date: music.release_date,
          // ACRCloud a veces devuelve IDs o URLs directas
          apple_music_url: appleMusic?.track?.id ? `https://music.apple.com/song/${appleMusic.track.id}` : undefined,
          // Datos para el reseteo dinámico
          duration_ms: music.duration_ms,
          offset_ms: music.play_offset_ms,
          // Intentaremos buscar el cover en el cliente con los nuevos metadatos si no viene aquí
        }
      });
    }

    return response.status(200).json({
      success: false,
      status: result.status,
      message: 'No track identified'
    });

  } catch (error: any) {
    console.error('Identification error:', error);
    return response.status(500).json({ 
      error: 'Failed to identify track',
      message: error.message 
    });
  }
}

/**
 * Captura un fragmento del stream de audio durante un tiempo determinado.
 */
async function captureStreamChunk(url: string, durationMs: number): Promise<Uint8Array> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), durationMs + 2000); // Margen de gracia

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalLength = 0;
    const startTime = Date.now();

    while (Date.now() - startTime < durationMs) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        totalLength += value.length;
      }
    }

    // Cancelar el stream después de obtener lo necesario
    reader.cancel();
    clearTimeout(timeoutId);

    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // Si se abortó por tiempo, retornamos lo que tengamos
      // (pero el bucle while ya controla eso, así que esto es por si fetch tarda mucho)
    }
    throw error;
  }
}

/**
 * Genera la firma para la API de ACRCloud
 */
function buildSignature(
  method: string,
  uri: string,
  accessKey: string,
  accessSecret: string,
  dataType: string,
  signatureVersion: string,
  timestamp: number
): string {
  const stringToSign = [
    method,
    uri,
    accessKey,
    dataType,
    signatureVersion,
    timestamp
  ].join('\n');

  return crypto
    .createHmac('sha1', accessSecret)
    .update(Buffer.from(stringToSign, 'utf-8'))
    .digest()
    .toString('base64');
}

