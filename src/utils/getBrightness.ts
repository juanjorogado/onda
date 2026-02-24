/**
 * Calcula el brillo relativo de un color en formato HSL
 * @param h - Matiz (0-360)
 * @param s - Saturación (0-100)
 * @param l - Claridad (0-100)
 * @returns Brillo relativo (0-255)
 */
export function getHslBrightness(h: number, s: number, l: number): number {
  // Convertir HSL a RGB para calcular el brillo relativo (fórmula estándar)
  // Brillo = 0.2126 * R + 0.7152 * G + 0.0722 * B
  
  const l_normalized = l / 100;
  const s_normalized = s / 100;
  
  const c = (1 - Math.abs(2 * l_normalized - 1)) * s_normalized;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l_normalized - c / 2;
  
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
  
  const r_final = (r + m) * 255;
  const g_final = (g + m) * 255;
  const b_final = (b + m) * 255;
  
  return 0.2126 * r_final + 0.7152 * g_final + 0.0722 * b_final;
}

/**
 * Calcula el brillo promedio de una imagen usando Canvas
 * @param imageUrl - URL de la imagen
 * @returns Promesa que resuelve al brillo promedio (0-255)
 */
export async function getImageBrightness(imageUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(128); // Fallback a brillo medio
        return;
      }
      
      // Escalar la imagen a un tamaño pequeño para procesar rápido
      canvas.width = 10;
      canvas.height = 10;
      ctx.drawImage(img, 0, 0, 10, 10);
      
      const imageData = ctx.getImageData(0, 0, 10, 10).data;
      let totalBrightness = 0;
      
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        // Brillo relativo
        totalBrightness += (0.2126 * r + 0.7152 * g + 0.0722 * b);
      }
      
      resolve(totalBrightness / (imageData.length / 4));
    };
    
    img.onerror = () => {
      resolve(128); // Fallback en caso de error
    };
    
    img.src = imageUrl;
  });
}

/**
 * Parsea un gradiente HSL de ONDA y calcula su brillo promedio
 * @param gradient - String del gradiente (ej: linear-gradient(135deg, hsl(200, 50%, 60%) 0%, ...))
 * @returns Brillo promedio (0-255)
 */
export function getGradientBrightness(gradient: string): number {
  // Extraer todos los hsl(...) del gradiente
  const hslMatches = gradient.match(/hsl\(\s*(\d+),\s*(\d+)%,\s*(\d+)%\s*\)/g);
  if (!hslMatches) return 128;
  
  let totalBrightness = 0;
  hslMatches.forEach(match => {
    const parts = match.match(/\d+/g);
    if (parts && parts.length >= 3) {
      totalBrightness += getHslBrightness(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10),
        parseInt(parts[2], 10)
      );
    }
  });
  
  return totalBrightness / hslMatches.length;
}
