import { TrackInfo } from '../types/track';

interface IdentificationResult extends TrackInfo {
  apple_music_url?: string;
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
  saveToAnytype: async (track: IdentificationResult): Promise<boolean> => {
    // Usamos tanto VITE_ como la forma estándar de Vercel por si acaso
    const webhookUrl = import.meta.env.VITE_ANYTYPE_WEBHOOK_URL || (window as any)._env_?.VITE_ANYTYPE_WEBHOOK_URL;
    
    console.log('DEBUG: Preparando envío al webhook...', { 
      urlConfigurada: !!webhookUrl, 
      urlParcial: webhookUrl ? `${webhookUrl.substring(0, 20)}...` : 'N/A',
      cancion: track.title 
    });

    try {
      const payload = {
        source: 'ONDA Radio',
        timestamp: new Date().toISOString(),
        space: 'Music Collection',
        track: {
          title: track.title,
          artist: track.artist,
          album: track.album,
          year: track.year,
          apple_music_url: track.apple_music_url,
          spotify_url: track.spotify_url,
          cover: track.cover,
        }
      };

      console.log('Enviando payload a webhook (con proxy si está desplegado)...');

      // 1) Intentar pasar por el proxy serverless para evitar CORS y obtener respuesta real
      const proxyResp = await fetch('/api/forward-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUrl: webhookUrl, ...payload }),
      });

      // Si el proxy funciona, terminamos aquí
      if (proxyResp.ok) {
        const info = await proxyResp.json().catch(() => ({}));
        console.log('Proxy webhook result:', info);
        return true;
      }

      // 2) Si no hay proxy o falla, intentar enviar directo (no-cors + text/plain)
      if (!webhookUrl) {
        console.warn('No hay proxy ni URL de webhook configurada. Saltando guardado.');
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

      // Con 'no-cors', la respuesta es "opaque", no podemos ver el status pero la petición se envía
      console.log('Petición enviada al webhook (modo no-cors/text-plain)');
      return true;
    } catch (error) {
      console.error('Error al guardar en Anytype:', error);
      return false;
    }
  }
};
