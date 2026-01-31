/**
 * Extracts the city name from a location string.
 * Handles formats like "Tokyo, Japan", "Paris, France", etc.
 * Returns the city part before the comma, or the original string if no comma.
 *
 * @param location - The location string (e.g., "Tokyo, Japan")
 * @returns The city name (e.g., "Tokyo")
 */
export function extractCity(location: string): string {
  if (!location || typeof location !== 'string') {
    return '';
  }

  const trimmed = location.trim();

  if (trimmed.length === 0) {
    return '';
  }

  const commaIndex = trimmed.indexOf(',');

  if (commaIndex === -1) {
    return trimmed;
  }

  return trimmed.slice(0, commaIndex).trim();
}
