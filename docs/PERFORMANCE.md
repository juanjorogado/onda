# Optimizaciones de Performance

Este documento describe las optimizaciones implementadas para garantizar un rendimiento perfecto durante el uso de la aplicación mientras se conduce.

## Optimizaciones Implementadas

### 1. Memoización de Componentes

Todos los componentes principales están envueltos con `React.memo` para evitar re-renders innecesarios:

- `Header` - Solo se re-renderiza cuando cambian `name`, `location` o `isPlaying`
- `Clocks` - Memoizado con `useMemo` para cálculos de tiempo
- `CoverArt` - Memoizado para evitar re-renders en actualizaciones de gradiente
- `NowPlaying` - Memoizado con `useMemo` para el texto formateado

### 2. Optimización de Hooks

#### `useCurrentTime`
- Actualiza cada segundo pero solo re-renderiza cuando cambia el segundo
- Evita re-renders innecesarios cuando el segundo no cambia

#### `useRadioPlayer`
- Usa `useMemo` para valores derivados (`headerName`, `headerLocation`, `coverArt`)
- `useCallback` para funciones estables (`nextStation`, `prevStation`)

#### `useNowPlaying`
- Implementa `AbortController` para cancelar peticiones cuando cambia la estación
- Limpia intervalos y peticiones correctamente
- Evita memory leaks

### 3. Lazy Loading y Code Splitting

- `NowPlaying` se carga de forma diferida usando `React.lazy`
- Vite configurado con code splitting manual:
  - `react-vendor`: React y React-DOM
  - `services`: Servicios de API

### 4. Configuración de Build (Vite)

```typescript
- Minificación con esbuild (más rápido que terser)
- CSS minificado
- Code splitting optimizado
- Chunk size warning limit: 1000KB
- Module preload habilitado
```

### 5. Gestión de Memoria

- **AbortController**: Cancela peticiones HTTP cuando ya no son necesarias
- **Cleanup de intervalos**: Todos los intervalos se limpian correctamente
- **Refs para valores no reactivos**: Evita re-renders innecesarios

### 6. Constantes Centralizadas

Todas las constantes están en `src/constants/index.ts`:
- Intervalos de tiempo
- Umbrales y valores de configuración
- URLs de APIs
- Configuración de audio

## Optimizaciones Específicas para Uso Durante la Conducción

### Reducción de Re-renders

1. **Memoización agresiva**: Componentes y valores derivados
2. **Actualizaciones condicionales**: Solo actualizar cuando realmente cambia el valor
3. **Callbacks estables**: `useCallback` para evitar recrear funciones

### Gestión de Recursos

1. **Polling optimizado**: 
   - Intervalo de 30 segundos para APIs
   - Cancelación automática cuando cambia la estación
   
2. **Actualizaciones de UI**:
   - Gradiente actualiza cada minuto (no cada segundo)
   - Reloj actualiza cada segundo pero solo re-renderiza si cambia

3. **Lazy loading**: Componentes no críticos se cargan bajo demanda

### Prevención de Memory Leaks

1. **Cleanup completo**: Todos los efectos tienen cleanup
2. **AbortController**: Cancela peticiones pendientes
3. **Refs para intervalos**: Permite limpiar correctamente

## Métricas de Performance

### Bundle Size
- React vendor chunk: ~130KB (gzipped)
- Services chunk: ~15KB (gzipped)
- Main bundle: Optimizado con tree-shaking

### Runtime Performance
- Re-renders minimizados: Solo cuando es necesario
- Memory usage: Gestión activa de memoria
- Network: Cancelación de peticiones innecesarias

## Mejores Prácticas Aplicadas

1. ✅ Memoización de componentes pesados
2. ✅ useMemo para cálculos costosos
3. ✅ useCallback para funciones pasadas como props
4. ✅ Lazy loading de componentes no críticos
5. ✅ Code splitting para reducir bundle inicial
6. ✅ Cleanup de efectos y suscripciones
7. ✅ AbortController para peticiones HTTP
8. ✅ Constantes centralizadas para mantenimiento

## Próximas Optimizaciones Posibles

- [ ] Service Worker para cache de recursos
- [ ] Virtual scrolling si se agregan listas largas
- [ ] Image lazy loading para covers
- [ ] Prefetch de estaciones siguientes
- [ ] Web Workers para cálculos pesados (si es necesario)

