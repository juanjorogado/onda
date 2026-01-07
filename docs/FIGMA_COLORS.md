# 🎨 Colores del Diseño de Figma

## Paleta de Colores Extraída

### Color de Marca (Círculo Indicador)
- **HEX**: `#ED3F1C`
- **RGB**: `rgb(237, 63, 28)`
- **Uso**: Círculo indicador de reproducción, elementos de marca
- **Estado actual en el proyecto**: ✅ Coincide con `--color-brand: #ED3F1C`

### Color de Papel (Fondo Blanco)
- **HEX**: `#FFFFFF`
- **RGB**: `rgb(255, 255, 255)`
- **Uso**: Fondo del player, fondo principal
- **Estado actual en el proyecto**: ✅ Coincide con `--color-paper: #FFFFFF`

### Color de Tinta (Texto Negro)
- **HEX**: `#000000`
- **RGB**: `rgb(0, 0, 0)`
- **Uso**: Texto principal, títulos
- **Estado actual en el proyecto**: ✅ Coincide con `--color-ink: #000000`

### Color de Fondo (Canvas Oscuro)
- **HEX**: `#1E1E1E`
- **RGB**: `rgb(30, 30, 30)`
- **Uso**: Fondo oscuro en modo dark
- **Estado actual en el proyecto**: ✅ `--color-dark-bg: #1E1E1E` (usa `--color-background` que es `#FFFFFF` en modo light)

### Colores Semánticos
- **--color-ink**: `#000000` (texto principal) → `#FFFFFF` en dark mode
- **--color-paper**: `#FFFFFF` (fondos) → `#1E1E1E` en dark mode
- **--color-background**: `#FFFFFF` (fondo general) → `#1E1E1E` en dark mode
- **--color-text-primary**: `#000000` (texto) → `#FFFFFF` en dark mode

### Gradientes
- **Default gradient**: `rgba(74, 96, 162, 1)` → `rgba(74, 96, 162, 0)`
- **Waiting gradient**: `rgba(182, 214, 194, 1)` → `rgba(74, 96, 162, 0)`
- Los gradientes se generan dinámicamente según la hora y ubicación de la estación

## Comparación con el Proyecto Actual

| Color | Figma | Proyecto Actual | Estado |
|-------|-------|-----------------|--------|
| Marca | `#ED3F1C` | `--color-brand: #ED3F1C` | ✅ Coincide |
| Papel (Light) | `#FFFFFF` | `--color-paper: #FFFFFF` | ✅ Coincide |
| Tinta (Light) | `#000000` | `--color-ink: #000000` | ✅ Coincide |
| Fondo (Dark) | `#1E1E1E` | `--color-dark-bg: #1E1E1E` | ✅ Coincide |

## Sistema de Colores Actual

El proyecto usa un sistema de colores semántico que se adapta automáticamente al modo dark:

- **Light mode** (por defecto): Fondo blanco, texto negro
- **Dark mode** (automático): Fondo oscuro (`#1E1E1E`), texto blanco

Los gradientes se generan dinámicamente usando `imageService.ts` basándose en:
- Hora del día en la ubicación de la estación
- Ubicación geográfica de la estación

## Archivo de Figma
- **URL**: https://www.figma.com/design/9fZXgJrzSndGEdhp4z6xaZ/onda
- **File Key**: `9fZXgJrzSndGEdhp4z6xaZ`

