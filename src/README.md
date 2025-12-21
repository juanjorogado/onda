# Estructura del Proyecto

## Organización de Carpetas

```
src/
├── components/     # Componentes React reutilizables
│   ├── Clocks.tsx
│   ├── CoverArt.tsx
│   ├── Header.tsx
│   └── NowPlaying.tsx
│
├── hooks/          # Custom React hooks
│   ├── useAudioPlayer.ts
│   ├── useCurrentTime.ts
│   ├── useNowPlaying.ts
│   ├── useRadioPlayer.ts
│   └── useWakeLock.ts
│
├── utils/          # Funciones utilitarias
│   └── formatTime.ts
│
├── data/           # Datos estáticos y configuración
│   └── stations.ts
│
├── styles/         # Estilos globales
│   └── global.css
│
├── types/          # Tipos TypeScript compartidos (futuro)
│
├── App.tsx         # Componente principal
└── main.tsx        # Punto de entrada
```

## Convenciones de Nomenclatura

### Componentes
- **Formato**: PascalCase
- **Extensión**: `.tsx`
- **Ejemplo**: `Header.tsx`, `CoverArt.tsx`

### Hooks
- **Formato**: camelCase con prefijo "use"
- **Extensión**: `.ts`
- **Ejemplo**: `useCurrentTime.ts`, `useRadioPlayer.ts`

### Utilidades
- **Formato**: camelCase
- **Extensión**: `.ts`
- **Ejemplo**: `formatTime.ts`

### Datos
- **Formato**: camelCase
- **Extensión**: `.ts`
- **Ejemplo**: `stations.ts`

### Estilos
- **Formato**: kebab-case o camelCase
- **Extensión**: `.css`
- **Ejemplo**: `global.css`

## Convenciones de Contenido

- **Components**: Componentes React puros, sin lógica de negocio
- **Hooks**: Lógica reutilizable y estado compartido
- **Utils**: Funciones puras sin dependencias de React
- **Data**: Datos estáticos, constantes y configuraciones
- **Styles**: Estilos globales y variables CSS

