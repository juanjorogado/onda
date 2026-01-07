# Estructura del Proyecto

## Organización de Carpetas

```
src/
├── app/             # Aplicación principal
│   ├── App.tsx      # Componente raíz de la aplicación
│   └── main.tsx     # Punto de entrada (bootstrap)
│
├── components/      # Componentes React organizados por tipo
│   ├── screens/     # Pantallas completas (vistas principales)
│   │   ├── PlayingScreen.tsx
│   │   └── WaitingScreen.tsx
│   └── ui/          # Componentes de interfaz reutilizables
│       └── NowPlaying.tsx
│
├── hooks/           # Custom React hooks organizados por dominio
│   ├── audio/       # Hooks relacionados con audio
│   │   ├── useAudioPlayer.ts
│   │   ├── useRadioPlayer.ts
│   │   └── useWakeLock.ts
│   ├── media/       # Hooks relacionados con media/metadatos
│   │   ├── useMediaSession.ts
│   │   └── useNowPlaying.ts
│   └── time/        # Hooks relacionados con tiempo
│       └── useCurrentTime.ts
│
├── services/        # Servicios de API y lógica externa
│   ├── imageService.ts
│   └── trackService.ts
│
├── utils/           # Funciones utilitarias puras
│   ├── formatTime.ts
│   └── getLocalCityName.ts
│
├── constants/       # Constantes centralizadas
│   └── index.ts
│
├── data/            # Datos estáticos y configuración
│   ├── stations.ts
│   └── timezoneToCity.json
│
├── types/           # Tipos TypeScript compartidos
│   ├── station.ts
│   ├── track.ts
│   └── vite-env.d.ts
│
└── styles/          # Estilos globales
    ├── animations.css
    └── global.css
```

## Convenciones de Nomenclatura

### Componentes
- **Formato**: PascalCase
- **Extensión**: `.tsx`
- **Ejemplo**: `PlayingScreen.tsx`, `WaitingScreen.tsx`

### Hooks
- **Formato**: camelCase con prefijo "use"
- **Extensión**: `.ts`
- **Ejemplo**: `useCurrentTime.ts`, `useRadioPlayer.ts`

### Servicios
- **Formato**: camelCase con sufijo "Service"
- **Extensión**: `.ts`
- **Ejemplo**: `imageService.ts`

### Utilidades
- **Formato**: camelCase
- **Extensión**: `.ts`
- **Ejemplo**: `formatTime.ts`, `getLocalCityName.ts`

### Datos
- **Formato**: camelCase para TypeScript, kebab-case para JSON
- **Extensión**: `.ts` o `.json`
- **Ejemplo**: `stations.ts`, `timezoneToCity.json`

### Tipos
- **Formato**: camelCase
- **Extensión**: `.ts`
- **Ejemplo**: `station.ts`, `track.ts`

### Estilos
- **Formato**: kebab-case
- **Extensión**: `.css`
- **Ejemplo**: `global.css`, `animations.css`

## Convenciones de Contenido

- **Components**: Componentes React puros, sin lógica de negocio
- **Hooks**: Lógica reutilizable y estado compartido
- **Services**: Llamadas a APIs externas y servicios de terceros
- **Utils**: Funciones puras sin dependencias de React
- **Data**: Datos estáticos, constantes y configuraciones
- **Types**: Interfaces y tipos TypeScript compartidos
- **Styles**: Estilos globales y variables CSS

## Separación de Responsabilidades

- **Services vs Utils**: Los servicios manejan APIs externas y lógica asíncrona. Las utilidades son funciones puras y síncronas.
- **Types**: Todos los tipos compartidos deben estar en `types/` para facilitar la importación y evitar duplicación.
- **Data**: Solo datos estáticos. La lógica de obtención de datos dinámicos va en `services/` o `hooks/`.

## Sistema de Diseño CSS

El proyecto usa CSS Custom Properties (variables CSS) organizadas en `global.css`:

- **Colores**: Sistema semántico con base, semánticas y con opacidad
- **Tipografía**: Tamaños base (16px), medio (24px) y grande (40px)
- **Spacing**: Sistema base en rem (0.25rem - 2rem) y valores específicos
- **Layout**: Anchuras de contenedor, alturas, y border radius
- **Animaciones**: Timing, easing, escalas, traducciones y opacidades
- **Dark mode**: Automático usando `@media (prefers-color-scheme: dark)`

Todas las variables están organizadas lógicamente y sin duplicados. Ver `src/styles/global.css` para más detalles.
