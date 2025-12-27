# Configuración para iOS - Prevenir que la app se cierre

Esta aplicación está configurada para funcionar como una PWA (Progressive Web App) en iOS, lo que permite que el audio continúe reproduciéndose incluso cuando la app está en segundo plano o la pantalla está bloqueada.

## Características implementadas

### 1. **PWA (Progressive Web App)**
- La app puede instalarse en la pantalla de inicio de iOS
- Funciona como una app nativa cuando está instalada
- El audio continúa reproduciéndose en segundo plano

### 2. **Media Session API**
- Controles de reproducción en la pantalla de bloqueo
- Información del track actual en la pantalla de bloqueo
- Controles para play/pause y cambiar de estación

### 3. **Wake Lock API**
- Previene que la pantalla se apague (Android)
- En iOS, el audio mantiene la app activa

### 4. **Atributos de Audio para iOS**
- `playsInline`: Permite reproducción en línea sin pantalla completa
- Manejo de eventos de visibilidad para mantener el audio activo

## Instalación en iOS

### Método 1: Desde Safari

1. Abre la app en **Safari** (no en Chrome u otros navegadores)
2. Toca el botón **Compartir** (cuadrado con flecha hacia arriba)
3. Selecciona **"Añadir a pantalla de inicio"**
4. Personaliza el nombre si lo deseas
5. Toca **"Añadir"**

### Método 2: Instalación automática

Si la app detecta que se puede instalar, mostrará un banner de instalación (esto requiere configuración adicional del manifest).

## Comportamiento en iOS

### Cuando está instalada como PWA:
- ✅ El audio continúa en segundo plano
- ✅ Los controles aparecen en la pantalla de bloqueo
- ✅ La app no se cierra automáticamente
- ✅ Funciona incluso con la pantalla bloqueada

### Cuando está en Safari (no instalada):
- ⚠️ El audio puede pausarse cuando cambias de app
- ⚠️ La app puede recargarse si iOS necesita memoria
- ✅ Los controles de pantalla de bloqueo funcionan

## Limitaciones de iOS

iOS tiene algunas limitaciones que no podemos evitar completamente:

1. **Wake Lock API no soportada**: iOS no soporta la API de Wake Lock, por lo que la pantalla se apagará normalmente. Sin embargo, el audio continuará.

2. **Reproducción en segundo plano**: Solo funciona completamente cuando la app está instalada como PWA. En Safari normal, el audio puede pausarse.

3. **Memoria**: Si iOS necesita memoria, puede terminar la app. Esto es normal y la app se recuperará cuando el usuario vuelva a abrirla.

## Solución de problemas

### El audio se detiene cuando bloqueo la pantalla
- **Solución**: Instala la app como PWA desde Safari (ver instrucciones arriba)

### No veo los controles en la pantalla de bloqueo
- **Solución**: Asegúrate de que estás reproduciendo audio y que la app está instalada como PWA

### La app se cierra cuando cambio a otra app
- **Solución**: Esto es normal en Safari. Instala la app como PWA para mejor comportamiento

## Notas técnicas

- La app usa `Media Session API` para controles en pantalla de bloqueo
- El audio tiene `playsInline` para evitar pantalla completa en iOS
- El manifest.json está configurado para `display: "standalone"`
- Los meta tags de iOS están configurados en `index.html`

