/**
 * Genera una URL de imagen del cielo usando Unsplash
 * @param city - Nombre de la ciudad
 * @returns URL de imagen de Unsplash del cielo relacionada con la ciudad
 */
export function getCitySkyImageUnsplash(city: string): string {
  // Usar Unsplash Source API para obtener imágenes del cielo relacionadas con la ciudad
  // El tamaño 600x600 es adecuado para el cover art
  return `https://source.unsplash.com/600x600/?sky,${encodeURIComponent(city)}`;
}

