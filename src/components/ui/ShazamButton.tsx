import { memo, useState, useCallback, useEffect } from 'react';
import { integrationService } from '../../services/integrationService';

interface ShazamButtonProps {
  streamUrl: string;
  onTrackIdentified?: (track: any) => void;
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
      <div className="shazam-icon">
        {isIdentifying ? (
          <div className="shazam-loading-spinner"></div>
        ) : isSuccess ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.49 6.81C15.12 5.83 13.38 5.5 12 5.5C8.69 5.5 6 8.19 6 11.5C6 13.05 6.58 14.45 7.5 15.49L6.4 16.6C5.17 15.35 4.5 13.55 4.5 11.5C4.5 7.36 7.86 4 12 4C13.85 4 15.55 4.58 16.9 5.6L16.49 6.81ZM19.5 11.5C19.5 14.14 18.22 16.47 16.5 17.99L15.4 16.88C16.77 15.74 17.5 13.73 17.5 11.5C17.5 9.04 16.2 7.04 14.5 5.88L15.6 4.77C17.83 6.26 19.5 8.69 19.5 11.5Z" fill="currentColor"/>
            <path d="M12 7.5C10.07 7.5 8.5 9.07 8.5 11C8.5 12.93 10.07 14.5 12 14.5C13.93 14.5 15.5 12.93 15.5 11C15.5 9.07 13.93 7.5 12 7.5Z" fill="currentColor"/>
          </svg>
        )}
      </div>
    </button>
  );
});

ShazamButton.displayName = 'ShazamButton';
