import { useEffect } from 'react';

type WakeLockType = Awaited<ReturnType<typeof navigator.wakeLock.request>>;

export function useWakeLock() {
  useEffect(() => {
    let wakeLock: WakeLockType | null = null;
    let video: HTMLVideoElement | null = null;
    
    const requestWakeLock = async () => {
      try {
        // 1. Wake Lock API (Android, Chrome, Safari 16.4+)
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          
          const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
              try {
                wakeLock = await (navigator as any).wakeLock.request('screen');
              } catch (err) {
                console.warn('Error re-requesting wake lock:', err);
              }
            }
          };
          
          document.addEventListener('visibilitychange', handleVisibilityChange);
        }
        
        // 2. iOS Fallback: Video invisible loop
        // En iOS, reproducir un video (incluso sin audio) previene que la pantalla se apague.
        // Esto es útil para versiones de iOS donde Wake Lock no es 100% fiable o no está presente.
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        if (isIOS) {
          video = document.createElement('video');
          video.muted = true;
          video.playsInline = true;
          video.loop = true;
          video.style.position = 'fixed';
          video.style.top = '0';
          video.style.left = '0';
          video.style.width = '1px';
          video.style.height = '1px';
          video.style.opacity = '0';
          video.style.pointerEvents = 'none';
          
          // Usar un video en blanco o muy pequeño (base64)
          video.src = 'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDJpc29tYXZjMQAAAZptb292AAAAbG12aGQAAAAA389EON/PRDgAAAPoAAAAKAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAGGlvZHMAAAAAEAAfQAABAAABAAAF93RyYWsAAABcdGtoZAAAAADfz0Q4389EOAAAAAEAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAEAAAAYZWR0cwAAABxlbHN0AAAAAAAAAAEAAAAKAAAAAAABAAAAAAXGbWRpYQAAACBtZGhkAAAAAN/PRDjfz0Q4AAAALwAAACgAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAEGRtbmQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAA51cmwgAAAAAQAAASZzdGJsAAAAb3N0c2QAAAAAAAAAAQAAAF9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAgACABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAM/+EAFWfEwAy0Z8SADLRn5AAAAwCAAAADAAIAAAADeB6SDAAAAAhzdHRzAAAAAAAAAAEAAAABAAAACgAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAABxzdHN6AAAAAAAAAAAAAAABAAAACgAAABRzdGNvAAAAAAAAAAEAAAA0AAAAYXVkdGEAAABZbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpciAAAAAAAAAAAAAAAAAAAAAAYXBwbAAAAClpbHN0AAAAIal0b28AAAAbZGF0YQAAAAEAAAAAbGF2ZTU4LjI5LjEwMAAAAGNmcmVlAAAAsW1kYXQ=';
          
          document.body.appendChild(video);
          video.play().catch(err => {
            console.warn('Error playing wake lock video:', err);
          });
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
      if (video) {
        video.pause();
        video.src = '';
        video.load();
        video.remove();
      }
    };
  }, []);
}
