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
    const webhookUrl = import.meta.env.VITE_ANYTYPE_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('VITE_ANYTYPE_WEBHOOK_URL no configurado. El tema no se guardará automáticamente.');
      return false;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error al guardar en Anytype:', error);
      return false;
    }
  }
};
