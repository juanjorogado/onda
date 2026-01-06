#!/usr/bin/env python3
import os
import sys
import json
import subprocess

try:
    import cloudscraper
    session = cloudscraper.create_scraper()
    use_cloudscraper = True
except ImportError:
    import requests
    session = requests.Session()
    use_cloudscraper = False
    print("Advertencia: cloudscraper no está instalado. Puede haber problemas con Cloudflare.", file=sys.stderr)

# Intentar obtener el token de la variable de entorno de múltiples formas
token = os.environ.get('PENPOT_TOKEN')

# Si no está disponible, intentar obtenerlo del shell
if not token:
    try:
        result = subprocess.run(
            ['bash', '-c', 'echo $PENPOT_TOKEN'],
            capture_output=True,
            text=True,
            timeout=5
        )
        token = result.stdout.strip()
    except:
        pass

# Si se proporciona como argumento, usarlo
if not token and len(sys.argv) > 1:
    token = sys.argv[1]

if not token:
    print("Error: La variable de entorno PENPOT_TOKEN no está configurada", file=sys.stderr)
    print("Uso: python3 fetch_penpot.py [TOKEN]", file=sys.stderr)
    print("O exporta la variable: export PENPOT_TOKEN='tu-token-aqui'", file=sys.stderr)
    sys.exit(1)

# Headers para la API de Penpot
headers = {
    'Authorization': f'Token {token}',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
}

# Configurar headers en la sesión
session.headers.update(headers)

# URL base de la API de Penpot
base_url = 'https://design.penpot.app/api/rpc/command'

# Buscar el archivo "Onda"
print("Buscando el archivo 'Onda' en Penpot...")

try:
    # Primero obtener el perfil para entender la estructura
    print("Obteniendo información del perfil...")
    profile_response = session.post(
        f'{base_url}/get-profile',
        json={}
    )
    
    if profile_response.status_code == 200:
        profile = profile_response.json()
        print("✓ Perfil obtenido correctamente")
        
        # Intentar obtener los archivos del equipo
        # Necesitamos el team-id, que podría estar en el perfil
        teams = profile.get('teams', [])
        if teams:
            team_id = teams[0].get('id') if isinstance(teams[0], dict) else teams[0]
            print(f"Usando team-id: {team_id}")
            
            # Obtener archivos del equipo
            print("Obteniendo archivos del equipo...")
            files_response = session.post(
                f'{base_url}/get-team-files',
                json={'team-id': team_id}
            )
            
            if files_response.status_code == 200:
                files = files_response.json()
                print(f"✓ {len(files) if isinstance(files, list) else 0} archivos encontrados")
                
                # Buscar el archivo "Onda"
                onda_file = None
                if isinstance(files, list):
                    for file in files:
                        name = file.get('name', '') if isinstance(file, dict) else str(file)
                        if 'onda' in name.lower():
                            onda_file = file
                            break
                
                if onda_file:
                    file_id = onda_file.get('id') if isinstance(onda_file, dict) else onda_file
                    print(f"\n✓ Archivo 'Onda' encontrado! ID: {file_id}")
                    
                    # Obtener el contenido completo del archivo
                    print("Obteniendo estructura completa del archivo...")
                    file_response = session.post(
                        f'{base_url}/get-file',
                        json={'file-id': file_id}
                    )
                    
                    if file_response.status_code == 200:
                        file_data = file_response.json()
                        print("✓ Archivo obtenido correctamente")
                        
                        # Guardar en un archivo JSON
                        output_file = 'onda_penpot.json'
                        with open(output_file, 'w', encoding='utf-8') as f:
                            json.dump(file_data, f, indent=2, ensure_ascii=False)
                        print(f"✓ Datos guardados en: {output_file}")
                        print(f"\nEstructura del archivo:")
                        print(json.dumps(file_data, indent=2, ensure_ascii=False))
                    else:
                        print(f"Error al obtener el archivo: {file_response.status_code}")
                        print(file_response.text)
                else:
                    print("\n✗ Archivo 'Onda' no encontrado")
                    print("Archivos disponibles:")
                    for file in files[:10]:  # Mostrar primeros 10
                        name = file.get('name', 'N/A') if isinstance(file, dict) else str(file)
                        print(f"  - {name}")
            else:
                print(f"Error al obtener archivos: {files_response.status_code}")
                print(files_response.text)
        else:
            print("No se encontraron equipos en el perfil")
            print("Perfil completo:")
            print(json.dumps(profile, indent=2, ensure_ascii=False))
    else:
        print(f"Error al obtener perfil: {profile_response.status_code}")
        print(profile_response.text)
            
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    sys.exit(1)

