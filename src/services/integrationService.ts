import { TrackInfo } from '../types/track';

interface IdentificationResult extends TrackInfo {
  spotify_url?: string;
}

/**
 * Servicio para integrar ONDA con herramientas externas como Anytype
 */
export const integrationService = {
  /**
   * Guarda un tema identificado en Anytype a través de un webhook.
   * Esto permite automatizar la colección musical sin salir de la app.
   */
  saveToAnytype: async (track: IdentificationResult, stationName?: string): Promise<boolean> => {
    // Usamos tanto VITE_ como la forma estándar de Vercel por si acaso
    const webhookUrl = import.meta.env.VITE_ANYTYPE_WEBHOOK_URL || window._env_?.VITE_ANYTYPE_WEBHOOK_URL;

    try {
      const payload = {
        source: 'ONDA Radio',
        timestamp: new Date().toISOString(),
        space: 'Music Collection',
        station: stationName,
        track: {
          title: track.title,
          artist: track.artist,
          album: track.album,
          year: track.year,
          genre: track.genre,
          apple_music_url: track.apple_music_url,
          cover: track.cover,
        }
      };

      const proxyResp = await fetch('/api/forward-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUrl: webhookUrl, ...payload }),
      });

      // Si el proxy funciona, terminamos aquí
      if (proxyResp.ok) {
        return true;
      }

      // 2) Si no hay proxy o falla, intentar enviar directo (no-cors + text/plain)
      if (!webhookUrl) {
        console.warn('No proxy or webhook URL configured. Skipping save.');
        return false;
      }

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', // Para Google Sheets/Scripts, necesitamos no-cors para evitar el preflight (OPTIONS) que no soporta
        headers: {
          'Content-Type': 'text/plain', // Usamos text/plain para que sea una "simple request" y pase el CORS
        },
        body: JSON.stringify(payload),
      });

      return true;
    } catch (error) {
      console.error('Failed to save to Anytype:', error);
      return false;
    }
  }
};
