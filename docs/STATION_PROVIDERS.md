# Proveedores de Metadata de Estaciones

Este documento describe los proveedores de metadata implementados para obtener información de tracks en tiempo real.

## Proveedores Implementados

### APIs Específicas

| Estación | ID | Provider | Descripción |
|----------|-----|----------|-------------|
| KEXP | `kexp` | `kexpProvider` | API oficial de KEXP |
| WFMU | `wfmu` | `wfmuProvider` | Web scraping de WFMU |
| Dublab | `dublab` | `dublabProvider` | API pública de Dublab |
| Radio Nova | `radio-nova` | `radioNovaProvider` | API de Nova Planet |
| TSF Jazz | `tsf-jazz` | `tsfJazzProvider` | API de TSF Jazz |
| Worldwide FM | `worldwide-fm` | `worldwideFmProvider` | API de Worldwide FM |
| OTTAVA | `ottava` | `ottavaProvider` | API de OTTAVA (Japón) |

### Providers Genéricos

| Estación | ID | Provider | Tipo |
|----------|-----|----------|------|
| Jazz Sakura | `jazz-sakura` | `icecastMetadataProvider` | Icecast/Shoutcast |
| Radio Relativa | `radio-relativa` | `icecastMetadataProvider` | Icecast/Shoutcast |
| Radio Raheem | `radio-raheem` | `icecastMetadataProvider` | Icecast/Shoutcast |
| Calm Radio | `calm-neoclassical` | `icecastMetadataProvider` | Icecast/Shoutcast |

## Extensión

Para añadir un nuevo provider:

1. Crear la función provider en `src/hooks/media/useNowPlaying.ts`:

```typescript
async function newStationProvider(
  station: Station,
  signal: AbortSignal
): Promise<TrackInfo | null> {
  try {
    const response = await fetch('https://api.station.com/nowplaying', {
      signal,
      headers: { 'Accept': 'application/json' },
    });

    if (signal.aborted) return null;
    if (!response.ok) return null;

    const data = await response.json();
    return {
      title: data?.title || undefined,
      artist: data?.artist || undefined,
      album: data?.album || undefined,
      cover: data?.cover || undefined,
    };
  } catch {
    return null;
  }
}
```

2. Registrar el provider en `STATION_PROVIDERS`:

```typescript
const STATION_PROVIDERS: Record<string, StationProvider> = {
  // ... providers existentes
  'new-station-id': newStationProvider,
};
```

## Funcionamiento

El hook `useNowPlaying` consulta el provider correspondiente cada 30 segundos (`POLLING_INTERVAL`). Si el provider retorna `null`, se usa el cover de la estación como fallback.

### Fallback de Metadatos

1. Intentar obtener metadata del provider específico
2. Si no hay provider o falla, buscar con `searchTrackInfo`
3. Si no hay resultados, usar cover de la estación

## Notas de Implementación

- Los providers deben manejar `AbortSignal` para cancelar requests
- Las respuestas deben ser rápidas (< 5 segundos)
- Se recomienda implementar cache en el provider si la API tiene rate limits
- Los providers deben ser tolerantes a fallos (nunca throw)
