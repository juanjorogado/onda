# Revisión de Taxonomía de Archivos

## Estado Actual

### ✅ Correcto

**Componentes (PascalCase)**
- `NowPlaying.tsx` → Componente React para mostrar información del track
- `PlayingScreen.tsx` → Pantalla cuando la radio está reproduciendo
- `WaitingScreen.tsx` → Pantalla cuando la radio está en espera

**Hooks (camelCase con prefijo "use")**
- `useAudioPlayer.ts` → Hook para manejar el reproductor de audio
- `useCurrentTime.ts` → Hook para obtener la hora actual
- `useMediaSession.ts` → Hook para Media Session API
- `useNowPlaying.ts` → Hook para obtener información del track actual
- `useRadioPlayer.ts` → Hook principal para el reproductor de radio
- `useWakeLock.ts` → Hook para mantener la pantalla activa

**Utils (camelCase)**
- `formatTime.ts` → Función utilitaria para formatear tiempo

**Services (camelCase con sufijo "Service")**
- `imageService.ts` → Servicio para manejar imágenes y gradientes
- `trackService.ts` → Servicio para obtener información de tracks

**Data (camelCase)**
- `stations.ts` → Datos estáticos de estaciones de radio

**Styles**
- `global.css` → Estilos globales y variables CSS
- `animations.css` → Animaciones y transiciones

## Convenciones Aplicadas

✅ **Componentes**: PascalCase, archivos `.tsx`
✅ **Hooks**: camelCase con prefijo "use", archivos `.ts`
✅ **Utils**: camelCase, archivos `.ts`
✅ **Services**: camelCase con sufijo "Service", archivos `.ts`
✅ **Data**: camelCase, archivos `.ts`
✅ **Styles**: kebab-case, archivos `.css`

## Convenciones Aplicadas

✅ **Componentes**: PascalCase, archivos `.tsx`
✅ **Hooks**: camelCase con prefijo "use", archivos `.ts`
✅ **Utils**: camelCase, archivos `.ts`
✅ **Data**: camelCase, archivos `.ts`
✅ **Styles**: kebab-case o camelCase, archivos `.css`






