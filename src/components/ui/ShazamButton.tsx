import { memo, useState, useCallback } from 'react';
import { TrackInfo } from '../../types/track';
import { integrationService } from '../../services/integrationService';

interface ShazamButtonProps {
  streamUrl: string;
  onTrackIdentified?: (track: TrackInfo) => void;
}

export const ShazamButton = memo(({ streamUrl, onTrackIdentified }: ShazamButtonProps) => {
  const [status, setStatus] = useState<'idle' | 'identifying' | 'success' | 'error'>('idle');

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar pausar la radio al tocar el botón
    
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
        onTrackIdentified?.(data.track);
        
        // Notificar al usuario (Feedback visual sutil)
        if ('vibrate' in navigator) navigator.vibrate([10, 30, 10]);

        // Guardar automáticamente en Anytype si está configurado
        await integrationService.saveToAnytype(data.track);

        // Mostrar estado de éxito temporalmente
        setStatus('success');
      } else {
        console.warn('No se pudo identificar la canción:', data.message || 'Sin resultados');
        setStatus('error');
        // Volver a estado idle tras 3 segundos de error
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error al identificar:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, [streamUrl, onTrackIdentified, status]);

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
        {isIdentifying ? (
          <div className="shazam-loading-spinner"></div>
        ) : isSuccess ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </div>
    </button>
  );
});

ShazamButton.displayName = 'ShazamButton';
