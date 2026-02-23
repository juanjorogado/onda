import { memo, useMemo } from 'react';
import { weatherToGradientParams } from '../../services/weatherService';
import { getWeatherInfluencedGradient } from '../../services/imageService';

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'foggy' | 'stormy' | 'snowy';

const TYPES: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'foggy', 'stormy', 'snowy'];
const INTENSITIES = [0.3, 0.6, 0.9];

export const WeatherDemo = memo(() => {
  const tiles = useMemo(() => {
    return TYPES.flatMap((type) =>
      INTENSITIES.map((intensity) => {
        const params = weatherToGradientParams({ type, description: type, intensity });
        const gradient = getWeatherInfluencedGradient('Kyoto, Japan', 'Asia/Tokyo', params);
        const tier = intensity < 0.4 ? 'low' : intensity < 0.7 ? 'mid' : 'high';
        return {
          type,
          intensity,
          tier,
          gradient,
          label: `${type} • ${Math.round(intensity * 100)}%`,
        };
      })
    );
  }, []);

  return (
    <div className="min-h-screen bg-paper font-sans safe-area">
      <div className="w-full" style={{ padding: '1rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {tiles.map(({ type, tier, gradient, label }) => (
            <div
              key={`${type}-${tier}`}
              className={`playing-screen-cover weather-${type} intensity-${tier}`}
              style={{
                background: gradient,
                minHeight: '280px',
                height: '280px',
                borderRadius: '1rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  bottom: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'var(--color-ink)',
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: '0.5rem',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

WeatherDemo.displayName = 'WeatherDemo';
