# Guía de Despliegue en Vercel

## Verificar Conexión con Vercel

### 1. Verificar en el Dashboard de Vercel

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Busca el proyecto `onda` o `onda-radio`
3. Verifica que el repositorio esté conectado:
   - Debe mostrar: `juanjorogado/onda`
   - Debe tener el icono de GitHub conectado

### 2. Si el proyecto NO está en Vercel

**Opción A: Conectar desde el Dashboard**
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Selecciona "Import Git Repository"
3. Conecta tu cuenta de GitHub si no está conectada
4. Selecciona el repositorio `juanjorogado/onda`
5. Vercel detectará automáticamente:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Haz clic en "Deploy"

**Opción B: Conectar desde CLI**
```bash
npm i -g vercel
vercel login
vercel link
vercel
```

### 3. Verificar Configuración de Git Hooks

Si el proyecto ya está conectado pero no despliega automáticamente:

1. Ve al proyecto en Vercel Dashboard
2. Settings → Git
3. Verifica que:
   - Production Branch: `main`
   - Auto-deploy: Activado
   - GitHub Integration: Conectada

### 4. Forzar un Nuevo Deploy

Si todo está conectado pero no despliega:

1. En Vercel Dashboard → Deployments
2. Haz clic en "Redeploy" en el último deployment
3. O ejecuta desde CLI:
   ```bash
   vercel --prod
   ```

### 5. Verificar Webhooks de GitHub

1. En GitHub: Settings → Webhooks
2. Debe haber un webhook de Vercel activo
3. Si no existe, Vercel lo creará automáticamente al conectar el proyecto

## Solución Rápida

Si necesitas un deploy inmediato:

```bash
# Desde la terminal
vercel --prod
```

Esto desplegará directamente sin esperar a GitHub.






