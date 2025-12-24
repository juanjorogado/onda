import { useState, useEffect } from 'react';

export function useImageBrightness(imageUrl: string | null): number {
  const [brightness, setBrightness] = useState<number>(0.5);

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
        
        const sampleSize = 100;
        const x = Math.floor((img.width - sampleSize) / 2);
        const y = Math.floor((img.height - sampleSize) / 2);
        const imageData = ctx.getImageData(x, y, sampleSize, sampleSize);
        const data = imageData.data;

        let totalLuminance = 0;
        let pixelCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          totalLuminance += luminance;
          pixelCount++;
        }

        const averageBrightness = totalLuminance / pixelCount;
        setBrightness(averageBrightness);
      } catch {
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
