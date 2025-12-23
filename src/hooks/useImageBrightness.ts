import { useState, useEffect } from 'react';

/**
 * Hook para calcular la luminosidad promedio de una imagen
 * Retorna un valor entre 0 (oscuro) y 1 (brillante)
 */
export function useImageBrightness(imageUrl: string | null): number {
  const [brightness, setBrightness] = useState<number>(0.5); // Default: asumir medio brillo

  useEffect(() => {
    if (!imageUrl) {
      setBrightness(0.5);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          setBrightness(0.5);
          return;
        }

        ctx.drawImage(img, 0, 0);
        
        // Obtener datos de la imagen (muestrear una región central para mejor rendimiento)
        const sampleSize = 100;
        const x = Math.floor((img.width - sampleSize) / 2);
        const y = Math.floor((img.height - sampleSize) / 2);
        const imageData = ctx.getImageData(x, y, sampleSize, sampleSize);
        const data = imageData.data;

        // Calcular luminosidad promedio usando la fórmula de luminosidad relativa
        let totalLuminance = 0;
        let pixelCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Fórmula de luminosidad relativa (ITU-R BT.709)
          const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          totalLuminance += luminance;
          pixelCount++;
        }

        const averageBrightness = totalLuminance / pixelCount;
        setBrightness(averageBrightness);
      } catch (error) {
        console.error('Error calculating image brightness:', error);
        setBrightness(0.5);
      }
    };

    img.onerror = () => {
      setBrightness(0.5);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  return brightness;
}

