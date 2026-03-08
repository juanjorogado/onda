import { memo, useState } from 'react';

interface ShazamButtonProps {
  streamUrl: string;
  onTrackIdentified?: (track: any) => void;
}

export const ShazamButton = memo(({ streamUrl, onTrackIdentified }: ShazamButtonProps) => {
  const [isIdentifying, setIsIdentifying] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar pausar la radio al tocar el botón
    
    if (isIdentifying) return;

    setIsIdentifying(true);

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
      } else {
        console.warn('No se pudo identificar la canción:', data.message || 'Sin resultados');
        // Aquí podríamos mostrar un toast o feedback visual de "no encontrado"
      }
    } catch (error) {
      console.error('Error al identificar:', error);
    } finally {
      setIsIdentifying(false);
    }
  };

  return (
    <button 
      className={`shazam-button ${isIdentifying ? 'is-identifying' : ''}`}
      onClick={handleClick}
      disabled={isIdentifying}
      aria-label={isIdentifying ? "Identificando..." : "Identificar canción"}
    >
      <div className="shazam-icon">
        {isIdentifying ? (
          <div className="shazam-loading-spinner"></div>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.49 6.81C15.12 5.83 13.38 5.5 12 5.5C8.69 5.5 6 8.19 6 11.5C6 13.05 6.58 14.45 7.5 15.49L6.4 16.6C5.17 15.35 4.5 13.55 4.5 11.5C4.5 7.36 7.86 4 12 4C13.85 4 15.55 4.58 16.9 5.6L16.49 6.81ZM19.5 11.5C19.5 14.14 18.22 16.47 16.5 17.99L15.4 16.88C16.77 15.74 17.5 13.73 17.5 11.5C17.5 9.04 16.2 7.04 14.5 5.88L15.6 4.77C17.83 6.26 19.5 8.69 19.5 11.5Z" fill="currentColor"/>
            <path d="M12 7.5C10.07 7.5 8.5 9.07 8.5 11C8.5 12.93 10.07 14.5 12 14.5C13.93 14.5 15.5 12.93 15.5 11C15.5 9.07 13.93 7.5 12 7.5Z" fill="currentColor"/>
          </svg>
        )}
      </div>
    </button>
  );
});

ShazamButton.displayName = 'ShazamButton';
