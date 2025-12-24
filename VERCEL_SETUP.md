# Configuración de Vercel - Paso a Paso

## El proyecto NO está conectado a Vercel

Para que Vercel detecte automáticamente los cambios de GitHub, necesitas conectarlo primero.

## Pasos para Conectar el Proyecto

### 1. Ve al Dashboard de Vercel
Abre: https://vercel.com/dashboard

### 2. Importar el Proyecto
1. Haz clic en **"Add New..."** → **"Project"**
2. O ve directamente a: https://vercel.com/new

### 3. Conectar GitHub (si no está conectado)
1. Si es la primera vez, verás un botón **"Connect GitHub"**
2. Autoriza a Vercel a acceder a tus repositorios
3. Selecciona los repositorios que quieres conectar (o todos)

### 4. Seleccionar el Repositorio
1. Busca y selecciona: **`juanjorogado/onda`**
2. Haz clic en **"Import"**

### 5. Configuración Automática
Vercel detectará automáticamente:
- ✅ Framework: **Vite**
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

**NO necesitas cambiar nada**, solo haz clic en **"Deploy"**

### 6. Primer Deploy
- Vercel comenzará a construir el proyecto
- Verás el progreso en tiempo real
- Al terminar, tendrás una URL de producción

### 7. Despliegues Automáticos
Una vez conectado:
- ✅ Cada `git push` a `main` → Deploy automático
- ✅ Cada Pull Request → Preview automático
- ✅ Notificaciones en GitHub

## Verificar que Funciona

Después de conectar:
1. Ve a **Deployments** en Vercel
2. Deberías ver el primer deploy
3. Haz un pequeño cambio y haz `git push`
4. Deberías ver un nuevo deploy iniciándose automáticamente

## Solución Rápida Alternativa

Si prefieres usar la CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Conectar el proyecto
vercel link

# Deploy
vercel --prod
```

Pero la forma más fácil es desde el dashboard web.





