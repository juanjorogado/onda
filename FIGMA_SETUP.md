# Configuración de Figma para el Proyecto Onda

## Información del Diseño

- **URL del Diseño**: https://www.figma.com/design/9fZXgJrzSndGEdhp4z6xaZ/onda
- **File Key**: `9fZXgJrzSndGEdhp4z6xaZ`
- **Node ID**: `9-140`

## Pasos para Obtener el Access Token

1. **Ve a Configuración de Figma**:
   - https://www.figma.com/settings
   - O: Perfil → Settings → Account

2. **Genera un Personal Access Token**:
   - Scroll hasta "Personal access tokens"
   - Haz clic en "Create new token"
   - Dale un nombre (ej: "Onda MCP")
   - Copia el token generado (solo se muestra una vez)

3. **Agrega el Token a mcp.json**:
   - Abre `/Users/juanjo/.cursor/mcp.json`
   - Reemplaza `""` en `FIGMA_ACCESS_TOKEN` con tu token
   - El token debería verse como: `figd_xxxxxxxxxxxxxxxxxxxxx`

## Estructura del Token

- **Access Token**: `figd_...` (para autenticación API)
- **File Key**: `9fZXgJrzSndGEdhp4z6xaZ` (ya configurado)

## Uso de la API de Figma

Si el servidor MCP no está disponible, puedes usar la API directamente:

```typescript
const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = '9fZXgJrzSndGEdhp4z6xaZ';

// Obtener información del archivo
const response = await fetch(
  `https://api.figma.com/v1/files/${FILE_KEY}`,
  {
    headers: { 'X-Figma-Token': FIGMA_TOKEN }
  }
);
```

## Verificar la Configuración

Una vez configurado el token, reinicia Cursor para que cargue la nueva configuración MCP.



