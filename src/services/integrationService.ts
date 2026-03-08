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
    
    console.log('Intentando guardar en Anytype...', { 
      hasWebhook: !!webhookUrl, 
      track: track.title 
    });

    if (!webhookUrl) {
      console.warn('VITE_ANYTYPE_WEBHOOK_URL no configurado. El tema no se guardará automáticamente.');
      return false;
    }

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

      console.log('Enviando payload a Anytype:', payload);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', // Algunos webhooks locales no manejan bien CORS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Con 'no-cors', la respuesta es opaca, así que asumimos éxito si no hay error
      console.log('Petición enviada a Anytype (modo no-cors)');
      return true;
    } catch (error) {
      console.error('Error al guardar en Anytype:', error);
      return false;
    }
  }
};
