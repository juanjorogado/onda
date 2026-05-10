import { memo, useState, useCallback } from 'react';
import { TrackInfo } from '../../types/track';
import { integrationService } from '../../services/integrationService';

interface ShazamButtonProps {
  streamUrl: string;
  stationName?: string;
  onTrackIdentified?: (track: TrackInfo) => Promise<TrackInfo>;
}

export const ShazamButton = memo(({ streamUrl, stationName, onTrackIdentified }: ShazamButtonProps) => {
  const [status, setStatus] = useState<'idle' | 'identifying' | 'success' | 'error'>('idle');

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (status === 'identifying') return;

    setStatus('identifying');

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamUrl }),
      });

      const data = await response.json();

      if (data.success && data.track) {
        // Wait for enriched track (genre, apple_music_url) before saving
        const enrichedTrack = await onTrackIdentified?.(data.track) ?? data.track;

        if ('vibrate' in navigator) navigator.vibrate([10, 30, 10]);
        await integrationService.saveToAnytype(enrichedTrack, stationName);
        setStatus('success');
      } else {
        console.warn('Could not identify track:', data.message || 'No results');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Track identification error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [streamUrl, stationName, onTrackIdentified, status]);

  // Si se identificó con éxito, el botón ya no es necesario (la info es visible)
  // Pero lo dejamos un momento para el feedback visual del checkmark
  
  const isIdentifying = status === 'identifying';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <button 
      className={`shazam-button ${isIdentifying ? 'is-identifying' : ''} ${isSuccess ? 'is-success' : ''} ${isError ? 'is-error' : ''}`}
      onClick={handleClick}
      disabled={isIdentifying || isSuccess}
      aria-label={isIdentifying ? "Identificando..." : isSuccess ? "Identificado" : "Identificar canción"}
    >
      <div className="shazam-icon" key={status}>
        <div className={`shazam-dot${isIdentifying ? ' is-identifying' : ''}${isSuccess ? ' is-success' : ''}${isError ? ' is-error' : ''}`}></div>
      </div>
    </button>
  );
});

ShazamButton.displayName = 'ShazamButton';
