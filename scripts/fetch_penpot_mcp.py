#!/usr/bin/env python3
"""
Script para obtener el archivo 'Onda' de Penpot usando el servidor MCP local
"""
import os
import sys
import json
import requests
import subprocess

def check_mcp_server():
    """Verifica si el servidor MCP está corriendo"""
    try:
        response = requests.get('http://localhost:4401/sse', timeout=2)
        return response.status_code == 200
    except:
        return False

def use_mcp_npx():
    """Intenta usar npx mcp-remote para comunicarse con el servidor MCP"""
    try:
        # Intentar listar archivos usando el servidor MCP
        result = subprocess.run(
            ['npx', '-y', 'mcp-remote', 'http://localhost:4401/sse', '--allow-http', '--help'],
            capture_output=True,
            text=True,
            timeout=10
        )
        print("MCP Remote disponible")
        print(result.stdout)
        return True
    except Exception as e:
        print(f"Error al usar MCP Remote: {e}")
        return False

def fetch_with_mcp():
    """Intenta obtener el archivo usando el protocolo MCP"""
    # El protocolo MCP usa JSON-RPC sobre SSE
    # Necesitamos hacer una solicitud inicial para establecer la conexión
    
    print("Intentando conectar con el servidor MCP de Penpot en localhost:4401...")
    
    if not check_mcp_server():
        print("⚠️  El servidor MCP no está respondiendo en localhost:4401")
        print("Asegúrate de que el servidor MCP de Penpot esté corriendo.")
        print("\nPara iniciar el servidor, podrías necesitar:")
        print("1. Abrir Penpot Desktop")
        print("2. O iniciar el servidor MCP manualmente")
        return None
    
    # Intentar hacer una solicitud MCP
    # El protocolo MCP usa Server-Sent Events (SSE)
    try:
        # Primero, intentar obtener información del servidor
        headers = {
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache'
        }
        
        response = requests.get(
            'http://localhost:4401/sse',
            headers=headers,
            stream=True,
            timeout=5
        )
        
        if response.status_code == 200:
            print("✓ Conectado al servidor MCP")
            # Leer algunas líneas del stream
            for i, line in enumerate(response.iter_lines()):
                if i > 10:  # Limitar a las primeras líneas
                    break
                if line:
                    print(f"  {line.decode('utf-8')}")
            return True
        else:
            print(f"Error: El servidor respondió con código {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ No se pudo conectar al servidor MCP")
        print("El servidor no está corriendo en localhost:4401")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    print("=" * 60)
    print("Buscando archivo 'Onda' en Penpot usando servidor MCP")
    print("=" * 60)
    print()
    
    # Verificar si el servidor está disponible
    if not fetch_with_mcp():
        print("\n" + "=" * 60)
        print("ALTERNATIVA: Usar script directo con API")
        print("=" * 60)
        print("\nSi el servidor MCP no está disponible, puedes usar:")
        print("  python3 fetch_penpot.py")
        print("\nAsegúrate de tener configurada la variable PENPOT_TOKEN")
        return
    
    # Si llegamos aquí, el servidor está disponible
    # Necesitaríamos implementar el protocolo MCP completo
    # que usa JSON-RPC sobre SSE
    print("\n⚠️  El protocolo MCP completo requiere implementación adicional")
    print("Para obtener el archivo 'Onda', necesitarías:")
    print("1. Establecer una conexión SSE persistente")
    print("2. Enviar mensajes JSON-RPC")
    print("3. Procesar las respuestas del servidor")
    
    print("\n💡 Sugerencia: Usa el script fetch_penpot.py con tu token")
    print("   o verifica que el servidor MCP de Penpot esté correctamente configurado")

if __name__ == '__main__':
    main()


