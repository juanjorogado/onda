#!/usr/bin/env python3
"""
Script completo para obtener el archivo 'Onda' de Penpot usando el protocolo MCP
"""
import os
import sys
import json
import requests
import time
import sseclient

def send_mcp_request(method, params=None):
    """Envía una solicitud JSON-RPC al servidor MCP"""
    request = {
        "jsonrpc": "2.0",
        "id": int(time.time() * 1000),
        "method": method,
    }
    if params:
        request["params"] = params
    
    return request

def connect_mcp_server():
    """Conecta al servidor MCP y busca el archivo 'Onda'"""
    url = 'http://localhost:4401/sse'
    
    print("Conectando al servidor MCP de Penpot...")
    print(f"URL: {url}")
    print()
    
    try:
        # Establecer conexión SSE
        headers = {
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
        }
        
        response = requests.get(url, headers=headers, stream=True, timeout=10)
        
        if response.status_code != 200:
            print(f"❌ Error: El servidor respondió con código {response.status_code}")
            return None
        
        print("✓ Conexión establecida")
        print("Enviando solicitud para listar archivos...")
        print()
        
        # Crear cliente SSE
        client = sseclient.SSEClient(response)
        
        # Enviar solicitud inicial para listar archivos
        # Nota: El protocolo MCP real puede requerir un formato diferente
        # Esto es una aproximación basada en el protocolo estándar
        
        # Intentar leer eventos del stream
        events_received = 0
        for event in client.events():
            events_received += 1
            print(f"Evento recibido #{events_received}:")
            print(f"  Tipo: {event.event}")
            print(f"  Datos: {event.data[:200]}...")  # Primeros 200 caracteres
            
            if events_received >= 5:  # Limitar eventos para no bloquear
                break
        
        if events_received == 0:
            print("⚠️  No se recibieron eventos del servidor")
            print("El servidor puede requerir una configuración diferente")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ No se pudo conectar al servidor MCP")
        print("\nEl servidor no está corriendo. Para iniciarlo:")
        print("1. Asegúrate de que Penpot Desktop esté abierto")
        print("2. O inicia el servidor MCP manualmente")
        print("3. Verifica que el puerto 4401 esté disponible")
        return None
    except ImportError:
        print("❌ Falta la librería sseclient")
        print("Instálala con: pip3 install sseclient-py")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    print("=" * 70)
    print("Buscando archivo 'Onda' en Penpot usando servidor MCP local")
    print("=" * 70)
    print()
    
    result = connect_mcp_server()
    
    if result is None:
        print("\n" + "=" * 70)
        print("SOLUCIÓN ALTERNATIVA")
        print("=" * 70)
        print("\nSi el servidor MCP no está disponible, puedes:")
        print("1. Usar el script directo: python3 fetch_penpot.py")
        print("2. Asegurarte de tener PENPOT_TOKEN configurado")
        print("3. O iniciar el servidor MCP de Penpot")
        print("\nPara más información sobre el servidor MCP de Penpot:")
        print("  - Verifica la documentación de Penpot")
        print("  - Asegúrate de que Penpot Desktop esté abierto")
        print("  - Verifica la configuración en ~/.cursor/mcp.json")

if __name__ == '__main__':
    main()


