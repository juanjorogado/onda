# ONDA Radio

Aplicación web de radio en streaming con estaciones curadas y diseño minimalista.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📋 Requisitos

- Node.js 18+
- Variables de entorno configuradas (ver [docs/ENV_SETUP.md](docs/ENV_SETUP.md))

## 📚 Documentación

Toda la documentación del proyecto está en la carpeta [`docs/`](docs/):

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Estructura del proyecto y convenciones
- **[ENV_SETUP.md](docs/ENV_SETUP.md)** - Configuración de variables de entorno
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Guía de despliegue
- **[IOS_SETUP.md](docs/IOS_SETUP.md)** - Configuración para iOS
- **[VERCEL_SETUP.md](docs/VERCEL_SETUP.md)** - Configuración para Vercel
- **[FIGMA_SETUP.md](docs/FIGMA_SETUP.md)** - Integración con Figma
- **[FIGMA_COLORS.md](docs/FIGMA_COLORS.md)** - Paleta de colores del diseño

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **CSS Custom Properties** - Sistema de diseño

## 📱 Características

- ✨ PWA (Progressive Web App) - Instalable en dispositivos móviles
- 🎨 Diseño minimalista y moderno
- 🌍 Múltiples estaciones de radio
- ⏰ Relojes con zonas horarias
- 🎵 Información de tracks en tiempo real
- 📱 Optimizado para iOS y Android

## 📖 Estructura del Proyecto

```
src/
├── components/     # Componentes React
├── hooks/          # Custom hooks
├── services/       # Servicios de API
├── utils/          # Utilidades
├── types/          # Tipos TypeScript
├── styles/         # Estilos globales
└── data/           # Datos estáticos
```

Para más detalles, consulta [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🔧 Configuración

1. Copia `.env.example` a `.env` (si existe)
2. Configura las variables de entorno necesarias
3. Consulta [docs/ENV_SETUP.md](docs/ENV_SETUP.md) para más información

## 📄 Licencia

Este proyecto es privado.

