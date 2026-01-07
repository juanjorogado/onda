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
│   └── formatTime.ts
│
├── constants/       # Constantes centralizadas
│   └── index.ts
│
├── data/            # Datos estáticos y configuración
│   └── stations.ts
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
- **Ejemplo**: `formatTime.ts`

### Datos
- **Formato**: camelCase
- **Extensión**: `.ts`
- **Ejemplo**: `stations.ts`

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
