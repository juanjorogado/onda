# Configuración de Variables de Entorno

Este proyecto requiere variables de entorno para funcionar correctamente. Sigue estos pasos para configurarlas.

## Pasos de Configuración

1. **Crea un archivo `.env` en la raíz del proyecto:**
   ```bash
   touch .env
   ```

2. **Añade las siguientes variables de entorno:**

   ```env
   # Google Gemini API Key (requerida para generar imágenes del cielo)
   # Obtén tu API key en: https://makersuite.google.com/app/apikey
   VITE_GEMINI_API_KEY=tu_api_key_aqui

   # Last.fm API Key (opcional, para información de tracks)
   # Obtén tu API key en: https://www.last.fm/api/account/create
   VITE_LASTFM_API_KEY=tu_api_key_aqui
   ```

3. **Reemplaza `tu_api_key_aqui` con tus propias API keys.**

## Variables de Entorno

### `VITE_GEMINI_API_KEY` (Requerida)
- **Descripción**: API key de Google Gemini para generar imágenes del cielo de las ciudades
- **Obtener**: https://makersuite.google.com/app/apikey
- **Comportamiento**: Si no está configurada, la app usará Unsplash como fallback

### `VITE_LASTFM_API_KEY` (Opcional)
- **Descripción**: API key de Last.fm para obtener información adicional de tracks
- **Obtener**: https://www.last.fm/api/account/create
- **Comportamiento**: Si no está configurada, la app usará MusicBrainz como alternativa

## Seguridad

⚠️ **IMPORTANTE**: 
- El archivo `.env` está en `.gitignore` y **NO se subirá a Git**
- **NUNCA** compartas tus API keys públicamente
- Para producción (Vercel, Netlify, etc.), configura las variables de entorno en el panel de configuración de tu plataforma

## Configuración en Vercel

Si estás usando Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Añade las variables:
   - `VITE_GEMINI_API_KEY`
   - `VITE_LASTFM_API_KEY`
4. Haz un nuevo deploy

## Verificación

Después de configurar las variables, reinicia el servidor de desarrollo:

```bash
npm run dev
```

Si todo está correcto, no deberías ver warnings en la consola sobre API keys faltantes.

