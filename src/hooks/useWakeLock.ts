import { useEffect } from 'react';

export function useWakeLock() {
  useEffect(() => {
    let wakeLock: any = null;
    
    const requestWakeLock = async () => {
      try {
        // Wake Lock API (no soportado en iOS, pero funciona en Android)
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          
          // Re-request wake lock cuando se recupera la visibilidad
          const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible' && wakeLock === null) {
              try {
                wakeLock = await (navigator as any).wakeLock.request('screen');
              } catch (err) {
                console.warn('Error re-requesting wake lock:', err);
              }
            }
          };
          
          document.addEventListener('visibilitychange', handleVisibilityChange);
          
          return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
          };
        }
      } catch (err) {
        console.warn('Wake Lock no disponible:', err);
      }
    };
    
    requestWakeLock();
    
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, []);
}
