import { memo, useMemo } from 'react';
import { weatherToGradientParams } from '../../services/weatherService';
import { getWeatherInfluencedGradient } from '../../services/imageService';

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'foggy' | 'stormy' | 'snowy' | 'windy';

const TYPES: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'foggy', 'stormy', 'snowy', 'windy'];
const CARD_INTENSITIES = [0.3, 0.6, 0.9];

export const WeatherDemo = memo(() => {
  const cards = useMemo(() => {
    return TYPES.map((type) => {
      const samples = CARD_INTENSITIES.map((intensity) => {
        const params = weatherToGradientParams({ type, description: type, intensity });
        const gradient = getWeatherInfluencedGradient('Kyoto, Japan', 'Asia/Tokyo', params);
        const tier = intensity < 0.4 ? 'low' : intensity < 0.7 ? 'mid' : 'high';
        return {
          type,
          intensity,
          tier,
          gradient,
          label: `${Math.round(intensity * 100)}%`,
        };
      });
      return { type, samples };
    });
  }, []);

  return (
    <div className="min-h-screen bg-paper font-sans safe-area">
      <div className="w-full" style={{ padding: '1rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1rem',
          }}
        >
          {cards.map(({ type, samples }) => (
            <div
              key={type}
              style={{
                background: 'var(--color-paper)',
                borderRadius: 'var(--radius-card)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                border: 'var(--border-width-1) solid rgba(0,0,0,0.06)',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 0.25rem',
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                  {type}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-ink)', opacity: 0.7 }}>
                  Intensidades: baja • media • alta
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                }}
              >
                {samples.map(({ tier, gradient, label }) => (
                  <div
                    key={`${type}-${tier}`}
                    className={`playing-screen-cover weather-${type} intensity-${tier}`}
                    style={{
                      background: gradient,
                      minHeight: '160px',
                      height: '160px',
                      borderRadius: '1rem',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: '0.5rem',
                        bottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        color: 'var(--color-ink)',
                        padding: '0.2rem 0.4rem',
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
          ))}
        </div>
      </div>
    </div>
  );
});

WeatherDemo.displayName = 'WeatherDemo';
