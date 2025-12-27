# Configuración de Figma MCP

## Estado Actual

No existe un servidor MCP oficial de Figma. Hay varias opciones para conectar:

## Opción 1: Servidor MCP Personalizado (Recomendado)

Si necesitas conectar con Figma, necesitarás crear o usar un servidor MCP personalizado que use la API de Figma.

### Pasos:

1. **Obtener Token de Figma API**:
   - Ve a: https://www.figma.com/developers/api#access-tokens
   - Genera un Personal Access Token
   - Copia el token

2. **Configurar mcp.json**:
   ```json
   {
     "mcpServers": {
       "figma": {
         "command": "node",
         "args": ["/ruta/al/servidor-figma-mcp.js"],
         "env": {
           "FIGMA_ACCESS_TOKEN": "tu-token-aqui"
         }
       }
     }
   }
   ```

## Opción 2: Usar API de Figma Directamente

Si no hay servidor MCP disponible, puedes usar la API de Figma directamente en tu código:

```typescript
// Ejemplo de uso de Figma API
const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
  headers: { 'X-Figma-Token': FIGMA_TOKEN }
});
```

## Opción 3: Esperar Servidor MCP Oficial

Actualmente no hay un servidor MCP oficial de Figma. Puedes:
- Monitorear: https://github.com/modelcontextprotocol/servers
- Crear tu propio servidor MCP usando la API de Figma

## Obtener Token de Figma

1. Ve a: https://www.figma.com/settings
2. Scroll hasta "Personal access tokens"
3. Haz clic en "Create new token"
4. Copia el token generado
5. Úsalo en la variable de entorno `FIGMA_ACCESS_TOKEN`



