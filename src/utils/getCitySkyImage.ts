/**
 * Genera una URL de imagen del cielo usando la API de Gemini
 * @param city - Nombre de la ciudad
 * @returns URL de imagen generada o fallback
 */
export async function getCitySkyImageGemini(city: string): Promise<string> {
  try {
    // Usar la API de Gemini para generar una imagen del cielo de la ciudad
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyD1nXG0h60NJiJhtgxiZhFbDZyN7mTDLyM';

    const prompt = `A beautiful sky view over ${city} city, showing the current weather and time of day, photorealistic, high quality`;
    
    // Usar el endpoint correcto de Gemini para generación de imágenes
    // Modelo: gemini-2.5-flash-image-preview (modelo específico para generación de imágenes)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      console.error('Gemini API error:', errorData);
      
      // Si es error de cuota, usar fallback directamente
      if (response.status === 429) {
        throw new Error('Quota exceeded');
      }
      
      throw new Error(`Failed to generate image: ${response.status}`);
    }

    const data = await response.json();
    
    // La respuesta de Gemini con el modelo de imagen devuelve la imagen en inline_data
    if (data.candidates && data.candidates[0]?.content?.parts) {
      const parts = data.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Imagen en base64
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    // Si no encontramos imagen en la respuesta, lanzar error
    throw new Error('No image generated in response');
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    // Fallback a una imagen de Unsplash del cielo
    return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&q=80&sig=${encodeURIComponent(city)}`;
  }
}

/**
 * Genera una URL de imagen del cielo usando Unsplash (fallback rápido)
 * @param city - Nombre de la ciudad
 * @returns URL de imagen de Unsplash del cielo relacionada con la ciudad
 */
export function getCitySkyImageUnsplash(city: string): string {
  // Usar Unsplash Source API para obtener imágenes del cielo relacionadas con la ciudad
  // El tamaño 600x600 es adecuado para el cover art
  return `https://source.unsplash.com/600x600/?sky,${encodeURIComponent(city)}`;
}
