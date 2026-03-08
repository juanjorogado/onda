/**
 * Fetch with timeout - Aborts request if it takes too long
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new DOMException('Fetch timed out', 'AbortError');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Safe fetch with timeout and error handling
 */
export async function safeFetch<T>(
  url: string,
  options?: RequestInit & { timeout?: number }
): Promise<T | null> {
  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      timeout: options?.timeout ?? 10000,
    });
    if (!response.ok) return null;
    return await response.json() as T;
  } catch {
    return null;
  }
}
