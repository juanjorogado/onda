/**
 * Genera una URL de imagen del cielo usando la API de Gemini
 * @param city - Nombre de la ciudad
 * @returns URL de imagen generada o fallback
 */
export async function getCitySkyImageGemini(city: string): Promise<string> {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!API_KEY) {
      console.warn('VITE_GEMINI_API_KEY no está configurada. Usando fallback de Unsplash.');
      return getCitySkyImageUnsplash(city);
    }
    const prompt = `A beautiful sky view over ${city} city, showing the current weather and time of day, photorealistic, high quality`;
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
      if (response.status === 429) throw new Error('Quota exceeded');
      throw new Error(`Failed to generate image: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error('No image generated in response');
  } catch {
    return `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&q=80&sig=${encodeURIComponent(city)}`;
  }
}

/**
 * Genera una URL de imagen del cielo usando Unsplash (fallback rápido)
 * @param city - Nombre de la ciudad
 * @returns URL de imagen de Unsplash del cielo relacionada con la ciudad
 */
export function getCitySkyImageUnsplash(city: string): string {
  return `https://source.unsplash.com/600x600/?sky,${encodeURIComponent(city)}`;
}


