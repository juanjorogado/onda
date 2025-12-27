# Guía de Configuración de Figma MCP

## Servidor MCP de Figma

Figma tiene un servidor MCP oficial que se puede usar de dos formas:

### Opción 1: Servidor Remoto (Configurado)
- **URL**: `https://mcp.figma.com/mcp`
- **Ventaja**: No requiere la app de escritorio
- **Estado**: ✅ Configurado en `mcp.json`

### Opción 2: Servidor Local (Alternativa)
- **URL**: `http://127.0.0.1:3845/mcp`
- **Requisito**: App de escritorio de Figma abierta con Dev Mode activado
- **Cómo activar**:
  1. Abre la app de escritorio de Figma
  2. Abre tu diseño: https://www.figma.com/design/9fZXgJrzSndGEdhp4z6xaZ/onda
  3. Presiona `Shift + D` para activar Dev Mode
  4. En el panel de inspección, haz clic en "Habilitar servidor MCP de escritorio"

## Configuración Actual

El archivo `mcp.json` está configurado para usar el servidor remoto de Figma.

## Uso

Una vez reiniciado Cursor, puedes:
- Pedir ayuda para implementar diseños de Figma
- Obtener tokens de diseño (colores, tipografías, espaciados)
- Sincronizar estilos desde Figma

## Verificar Conexión

1. Reinicia Cursor completamente
2. Abre la paleta de comandos (`Shift + Command + P`)
3. Busca comandos relacionados con MCP o Figma
4. Prueba a pedir: "Muéstrame los colores del diseño de Figma"

## Referencias

- Documentación oficial: https://developers.figma.com/docs/figma-mcp-server/
- Servidor remoto: https://mcp.figma.com/mcp


