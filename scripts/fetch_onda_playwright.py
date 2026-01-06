#!/usr/bin/env python3
"""
Script para obtener el archivo 'Onda' de Penpot usando Playwright para evitar Cloudflare
"""
import os
import sys
import json
import asyncio
from playwright.async_api import async_playwright

async def fetch_onda_with_playwright(token):
    """Obtiene el archivo Onda usando Playwright para evitar Cloudflare"""
    print("Usando Playwright para simular un navegador real...")
    
    async with async_playwright() as p:
        print("Iniciando navegador...")
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = await context.new_page()
        
        try:
            # Primero navegar a la página principal para que Cloudflare valide el navegador
            print("Navegando a Penpot para validar el navegador...")
            await page.goto('https://design.penpot.app/', wait_until='networkidle', timeout=30000)
            await asyncio.sleep(2)  # Esperar un poco para que Cloudflare complete la validación
            
            # Ahora hacer la solicitud POST usando el contexto del navegador
            print("Enviando solicitud a la API de Penpot...")
            response = await page.request.post(
                'https://design.penpot.app/api/rpc/command/get-profile',
                headers={
                    'Authorization': f'Token {token}',
                    'Content-Type': 'application/json',
                },
                data=json.dumps({})
            )
            
            if response.status == 200:
                profile = await response.json()
                print("✓ Perfil obtenido correctamente")
                
                # Obtener teams
                teams = profile.get('teams', [])
                if not teams:
                    print("❌ No se encontraron equipos")
                    return None
                
                team_id = teams[0].get('id') if isinstance(teams[0], dict) else teams[0]
                print(f"Usando team-id: {team_id}")
                
                # Obtener archivos
                print("Obteniendo archivos del equipo...")
                files_response = await page.request.post(
                    'https://design.penpot.app/api/rpc/command/get-team-files',
                    headers={
                        'Authorization': f'Token {token}',
                        'Content-Type': 'application/json',
                    },
                    data=json.dumps({'team-id': team_id})
                )
                
                if files_response.status != 200:
                    print(f"❌ Error al obtener archivos: {files_response.status}")
                    return None
                
                files = await files_response.json()
                print(f"✓ {len(files) if isinstance(files, list) else 0} archivos encontrados")
                
                # Buscar archivo "Onda"
                onda_file = None
                if isinstance(files, list):
                    for file in files:
                        name = file.get('name', '') if isinstance(file, dict) else str(file)
                        if 'onda' in name.lower():
                            onda_file = file
                            break
                
                if not onda_file:
                    print("\n❌ Archivo 'Onda' no encontrado")
                    print("\nArchivos disponibles:")
                    for i, file in enumerate(files[:10], 1):
                        name = file.get('name', 'N/A') if isinstance(file, dict) else str(file)
                        print(f"  {i}. {name}")
                    return None
                
                file_id = onda_file.get('id') if isinstance(onda_file, dict) else onda_file
                print(f"\n✓ Archivo 'Onda' encontrado! ID: {file_id}")
                
                # Obtener contenido completo
                print("Obteniendo estructura completa del archivo...")
                file_response = await page.request.post(
                    'https://design.penpot.app/api/rpc/command/get-file',
                    headers={
                        'Authorization': f'Token {token}',
                        'Content-Type': 'application/json',
                    },
                    data=json.dumps({'file-id': file_id})
                )
                
                if file_response.status != 200:
                    print(f"❌ Error al obtener archivo: {file_response.status}")
                    return None
                
                file_data = await file_response.json()
                print("✓ Archivo obtenido correctamente")
                
                # Guardar en archivo
                output_file = 'onda_penpot.json'
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(file_data, f, indent=2, ensure_ascii=False)
                
                print(f"\n✓ Datos guardados en: {output_file}")
                return file_data
            else:
                print(f"❌ Error: {response.status}")
                text = await response.text()
                print(f"Respuesta: {text[:500]}")
                return None
                
        finally:
            await browser.close()

def main():
    print("=" * 70)
    print("Buscando archivo 'Onda' en Penpot usando Playwright")
    print("=" * 70)
    print()
    
    # Obtener token
    token = None
    if len(sys.argv) > 1:
        token = sys.argv[1]
    else:
        token = os.environ.get('PENPOT_TOKEN')
    
    if not token:
        print("❌ Error: Token no proporcionado")
        print("\nUso: python3 fetch_onda_playwright.py TOKEN")
        print("O: export PENPOT_TOKEN='tu-token' && python3 fetch_onda_playwright.py")
        return
    
    # Ejecutar
    try:
        result = asyncio.run(fetch_onda_with_playwright(token))
        if result:
            print("\n" + "=" * 70)
            print("✓ ÉXITO: Archivo 'Onda' obtenido")
            print("=" * 70)
        else:
            print("\n" + "=" * 70)
            print("No se pudo obtener el archivo")
            print("=" * 70)
    except ImportError:
        print("❌ Playwright no está instalado")
        print("Instálalo con: pip3 install playwright")
        print("Luego ejecuta: playwright install chromium")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

