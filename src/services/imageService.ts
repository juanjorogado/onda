/**
 * Genera una imagen del cielo/nubes de una ciudad usando IA
 * @param city - Nombre de la ciudad
 * @returns URL de imagen generada o fallback
 */
export async function getCitySkyImage(city: string): Promise<string> {
  // Intentar primero con Gemini si está disponible
  const geminiImage = await getCitySkyImageGemini(city);
  if (geminiImage && !geminiImage.startsWith('https://source.unsplash.com')) {
    return geminiImage;
  }

  // Si Gemini falla, intentar con DALL-E si está disponible
  const dalleImage = await getCitySkyImageDALLE(city);
  if (dalleImage && !dalleImage.startsWith('https://source.unsplash.com')) {
    return dalleImage;
  }

  // Fallback final
  return getCitySkyImageFallback(city);
}

/**
 * Genera una URL de imagen del cielo usando la API de Gemini
 * @param city - Nombre de la ciudad
 * @returns URL de imagen generada o fallback
 */
async function getCitySkyImageGemini(city: string): Promise<string> {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
      return getCitySkyImageFallback(city);
    }

    // Prompt mejorado para generar imágenes de nubes/cielo específicas de la ciudad
    const prompt = `A beautiful, atmospheric sky view over ${city} city, dramatic clouds, skyline silhouette in the distance, cinematic lighting, photorealistic, high quality, 16:9 aspect ratio, moody and atmospheric`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Gemini API: Quota exceeded');
        return getCitySkyImageFallback(city);
      }
      throw new Error(`Gemini API failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error('No image generated in Gemini response');
  } catch (error) {
    console.warn('Error generating image with Gemini:', error);
    return getCitySkyImageFallback(city);
  }
}

/**
 * Genera una imagen del cielo usando DALL-E API (OpenAI)
 * @param city - Nombre de la ciudad
 * @returns URL de imagen generada o fallback
 */
async function getCitySkyImageDALLE(city: string): Promise<string> {
  try {
    const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

    if (!API_KEY) {
      return getCitySkyImageFallback(city);
    }

    const prompt = `A beautiful, atmospheric sky view over ${city} city, dramatic clouds, skyline silhouette in the distance, cinematic lighting, photorealistic, high quality, moody and atmospheric`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('DALL-E API: Rate limit exceeded');
        return getCitySkyImageFallback(city);
      }
      throw new Error(`DALL-E API failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.data?.[0]?.url) {
      return data.data[0].url;
    }

    throw new Error('No image URL in DALL-E response');
  } catch (error) {
    console.warn('Error generating image with DALL-E:', error);
    return getCitySkyImageFallback(city);
  }
}

/**
 * Genera una URL de imagen del cielo usando un servicio de fallback
 * Usa Unsplash para obtener imágenes reales de cielo/nubes
 * @param city - Nombre de la ciudad
 * @returns URL de imagen del cielo relacionada con la ciudad
 */
export function getCitySkyImageFallback(city: string): string {
  // Usar Unsplash Source API para imágenes de cielo/nubes
  // Formato: https://source.unsplash.com/WIDTHxHEIGHT/?KEYWORDS
  const keywords = `${city},sky,clouds,atmospheric`.replace(/\s+/g, ',');
  return `https://source.unsplash.com/1200x1200/?${encodeURIComponent(keywords)}`;
}

/**
 * Función de compatibilidad para código existente
 * @deprecated Usar getCitySkyImage en su lugar
 */
export async function getCitySkyImageGeminiLegacy(city: string): Promise<string> {
  return getCitySkyImage(city);
}


