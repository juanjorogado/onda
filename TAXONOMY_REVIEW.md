# Revisión de Taxonomía de Archivos

## Estado Actual

### ✅ Correcto

**Componentes (PascalCase)**
- `Clocks.tsx` → Componente React
- `CoverArt.tsx` → Componente React
- `Header.tsx` → Componente React
- `NowPlaying.tsx` → Componente React

**Hooks (camelCase con prefijo "use")**
- `useAudioPlayer.ts` → Hook personalizado
- `useNowPlaying.ts` → Hook personalizado
- `useRadioPlayer.ts` → Hook personalizado
- `useWakeLock.ts` → Hook personalizado
- `useNow.ts` → Hook personalizado ⚠️

**Utils (camelCase)**
- `formatTime.ts` → Función utilitaria

**Data (camelCase)**
- `stations.ts` → Datos estáticos

**Styles**
- `index.css` → Estilos globales ⚠️

## Problemas Identificados

### 1. **`useNow.ts` - Nombre poco descriptivo**
   - **Problema**: El nombre "useNow" no es claro sobre qué retorna
   - **Sugerencia**: `useCurrentTime.ts` o `useTime.ts`
   - **Razón**: Es más descriptivo y sigue la convención de hooks

### 2. **`Clocks.tsx` - Inconsistencia singular/plural**
   - **Problema**: Usa plural mientras otros componentes usan singular
   - **Sugerencia**: Mantener `Clocks` (es correcto porque muestra múltiples relojes) o `ClockDisplay`
   - **Razón**: Aunque muestra múltiples relojes, el nombre es aceptable

### 3. **`index.css` - Nombre genérico**
   - **Problema**: "index" no describe el contenido
   - **Sugerencia**: `global.css` o `styles.css`
   - **Razón**: Más descriptivo del propósito del archivo

## Recomendaciones

### Opción 1: Cambios Mínimos (Recomendado)
- Renombrar `useNow.ts` → `useCurrentTime.ts`
- Renombrar `index.css` → `global.css`

### Opción 2: Sin Cambios
- Mantener nombres actuales si el equipo los entiende
- Documentar la convención en README

## Convenciones Aplicadas

✅ **Componentes**: PascalCase, archivos `.tsx`
✅ **Hooks**: camelCase con prefijo "use", archivos `.ts`
✅ **Utils**: camelCase, archivos `.ts`
✅ **Data**: camelCase, archivos `.ts`
✅ **Styles**: kebab-case o camelCase, archivos `.css`


