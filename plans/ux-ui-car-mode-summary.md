# Resumen Ejecutivo: Mejoras UX/UI para ONDA Radio (Modo Conducción)

## 🎯 Problemas Críticos Identificados

### 1. Seguridad Vial
- **Texto pequeño** (24px) difícil de leer mientras se conduce
- **Áreas táctiles insuficientes** - riesgo de miss-clicks
- **Marquee scroll** distrae la atención visual constantemente
- **Sin feedback háptico** - incertidumbre sobre interacciones

### 2. Usabilidad
- No hay modo simplificado para conducción
- Sin indicadores visuales de gestos disponibles
- Contraste adaptativo puede no ser óptimo con luz solar
- Información del género musical no visible

---

## 📋 Priorización de Mejoras

### 🔴 ALTA PRIORIDAD (Implementar primero)

| # | Mejora | Impacto | Esfuerzo | Archivos a Modificar |
|---|--------|---------|----------|---------------------|
| 1 | **Modo Conducción (Car Mode)** | ⭐⭐⭐⭐⭐ Seguridad vial | Medio | `DrivingScreen.tsx` (nuevo), `useCarMode.ts` (nuevo) |
| 2 | **Controles táctiles grandes (88px+)** | ⭐⭐⭐⭐⭐ Reducción errores | Bajo | `LargeTouchControls.tsx` (nuevo), `car-mode.css` |
| 3 | **Feedback háptico y sonoro** | ⭐⭐⭐⭐⭐ Confirmación acciones | Bajo | `useCarFeedback.ts` (nuevo) |
| 4 | **Texto escalable (32-64px)** | ⭐⭐⭐⭐ Legibilidad | Bajo | `ScalableText.tsx` (nuevo) |

### 🟡 MEDIA PRIORIDAD (Implementar después)

| # | Mejora | Impacto | Esfuerzo | Archivos a Modificar |
|---|--------|---------|----------|---------------------|
| 5 | **Indicadores de swipe visuales** | ⭐⭐⭐ Descubribilidad | Bajo | `SwipeHint.tsx` (nuevo) |
| 6 | **Contraste alto manual** | ⭐⭐⭐ Visibilidad solar | Medio | `global.css` (media queries) |
| 7 | **Mostrar género de estación** | ⭐⭐ Contexto musical | Bajo | `NowPlaying.tsx` |
| 8 | **Volumen visual** | ⭐⭐ Feedback de audio | Medio | Nuevo componente |

### 🟢 BAJA PRIORIDAD (Futuro)

| # | Mejora | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 9 | Detección automática modo coche | ⭐⭐ Conveniencia | Alto |
| 10 | Soporte Android Auto / CarPlay | ⭐⭐⭐ Integración | Alto |
| 11 | Controles por voz | ⭐⭐⭐⭐ Accesibilidad | Alto |
| 12 | Favoritos rápidos | ⭐⭐ Personalización | Medio |

---

## 🎨 Mockup Visual: Modo Conducción

### Versión Portrait (Móvil)

```
┌─────────────────────────────────────────┐
│  🚗  ONDA Radio            [ SALIR ]   │  ← Header: icono coche + botón salir
├─────────────────────────────────────────┤
│                                         │
│          ┌─────────────────┐            │
│          │                 │            │
│          │   COVER ART     │            │  ← Imagen/gradiente grande
│          │   (60% width)   │            │     centrado
│          │                 │            │
│          └─────────────────┘            │
│                                         │
│  JAZZ SAKURA                            │  ← Nombre estación (32px, bold)
│  Kyoto, Japan • Japanese Jazz           │  ← Ubicación + género (24px)
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  Midnight in a Perfect World            │  ← Track (28px)
│  DJ Shadow                              │  ← Artista (24px, secondary)
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   ┌────┐      ┌────────┐      ┌────┐   │
│   │◀◀  │      │   ⏸    │      │ ▶▶ │   │  ← Controles 88-120px
│   │    │      │        │      │    │   │     (anterior/play-pause/siguiente)
│   └────┘      └────────┘      └────┘   │
│                                         │
│  ◀  SWIPE PARA CAMBIAR ESTACIÓN  ▶      │  ← Hint de gestos (fading)
│                                         │
└─────────────────────────────────────────┘
```

### Versión Landscape (Tableta/Coche)

```
┌────────────────────────────────────────────────────────────────────┐
│  🚗  ONDA Radio                                    [ SALIR ]  14:32 │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   ┌──────────────┐     JAZZ SAKURA                                 │
│   │              │     Kyoto, Japan • Japanese Jazz               │
│   │              │                                                 │
│   │   COVER      │     ────────────────────────────────────────  │
│   │   ART        │                                                 │
│   │   (40vh)     │     Midnight in a Perfect World                 │
│   │              │     DJ Shadow                                   │
│   │              │                                                 │
│   └──────────────┘                                                 │
│                                                                    │
│          ┌────────┐      ┌────────┐      ┌────────┐                │
│          │  ◀◀   │      │   ⏸   │      │   ▶▶  │                │
│          │(88px) │      │(120px)│      │(88px) │                │
│          └────────┘      └────────┘      └────────┘                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📐 Especificaciones de Diseño

### Tamaños de Fuente

| Elemento | Tamaño Actual | Tamaño Modo Coche | Incremento |
|----------|---------------|-------------------|------------|
| Nombre estación | 24px | 36-48px | 150-200% |
| Ubicación | 24px | 24-32px | 100-133% |
| Track actual | 20px | 28-36px | 140-180% |
| Artista | 20px | 24-28px | 120-140% |
| Controles | 16px | 32-48px | 200-300% |

### Áreas Táctiles (mínimos WCAG / recomendados coche)

| Elemento | Actual | Mínimo | Recomendado |
|----------|--------|--------|-------------|
| Botón play/pause | Variable | 48x48px | 120x120px |
| Botón anterior/siguiente | N/A | 48x48px | 88x88px |
| Cover art | 100% width | 48x48px | Todo el área |
| Botón salir modo | N/A | 48x48px | 88x88px |

### Paleta de Colores Modo Coche

```css
/* Siempre oscuro para máximo contraste */
--car-bg: #000000;              /* Fondo puro */
--car-surface: #1a1a1a;         /* Superficies elevadas */
--car-text-primary: #ffffff;    /* Texto principal */
--car-text-secondary: #cccccc;  /* Texto secundario */
--car-accent: #ED3F1C;          /* Color brand ONDA */
--car-accent-hover: #ff6b4a;    /* Hover state */
--car-border: rgba(255,255,255,0.3);  /* Bordes sutiles */
```

---

## 🔧 Implementación Rápida (MVP)

### Paso 1: Crear CSS de Modo Coche (30 min)

```css
/* Agregar a global.css o crear car-mode.css */
.car-mode {
  --font-size-title: clamp(32px, 8vw, 48px);
  --font-size-body: clamp(20px, 4vw, 28px);
  --touch-min: 88px;
  --touch-large: 120px;
  
  background: #000;
  color: #fff;
}

.car-mode .station-name { font-size: var(--font-size-title); }
.car-mode .track-info { font-size: var(--font-size-body); }
.car-mode .control-btn { 
  min-width: var(--touch-min); 
  min-height: var(--touch-min);
}
```

### Paso 2: Crear Hook useCarMode (30 min)

```typescript
export function useCarMode() {
  const [isCarMode, setIsCarMode] = useState(false);
  
  const toggle = useCallback(() => {
    setIsCarMode(prev => {
      const next = !prev;
      localStorage.setItem('onda-car-mode', String(next));
      return next;
    });
  }, []);
  
  useEffect(() => {
    const saved = localStorage.getItem('onda-car-mode');
    if (saved === 'true') setIsCarMode(true);
  }, []);
  
  return { isCarMode, toggle };
}
```

### Paso 3: Integrar en App.tsx (15 min)

```tsx
function App() {
  const { isCarMode, toggle } = useCarMode();
  
  return (
    <div className={isCarMode ? 'car-mode' : ''}>
      <button onClick={toggle} className="car-mode-toggle">
        {isCarMode ? '🚗' : '📱'}
      </button>
      {/* Resto de la app */}
    </div>
  );
}
```

**Tiempo total estimado para MVP: 1-2 horas**

---

## ✅ Checklist de Seguridad Vial

Antes de considerar "listo para producción":

- [ ] Todo texto visible a 2 metros de distancia
- [ ] Controles usables con guantes
- [ ] Feedback háptico en cada interacción
- [ ] Sin animaciones automáticas (marquee pausado)
- [ ] Modo activable antes de iniciar marcha
- [ ] Prueba con usuario real en situación de conducción simulada
- [ ] Cumple WCAG 2.1 AA (contraste, tamaños, focus)

---

## 📊 Métricas de Éxito

| Métrica | Medición | Target |
|---------|----------|--------|
| Tiempo de interacción promedio | Analytics + testing | < 1.5 segundos |
| Tasa de error en taps | Analytics | < 3% |
| Satisfacción usuario | Encuesta 1-5 | > 4.0 |
| Uso modo coche | % usuarios activos | > 25% |
| Tiempo de atención visual | Testing eye-tracking | < 2 segundos |

---

## 🚀 Próximos Pasos Recomendados

1. **Inmediato**: Implementar CSS de modo coche básico
2. **Esta semana**: Agregar toggle de modo coche y probar en coche real
3. **Próxima semana**: Implementar controles grandes con feedback háptico
4. **Mes siguiente**: Mejoras de accesibilidad y detección automática

---

## 📞 Notas para Desarrollo

- Usar `prefers-reduced-motion` para respetar preferencias de usuario
- Testear con VoiceOver/TalkBack para accesibilidad
- Considerar soporte para volante Bluetooth (Media Session API ya implementada)
- Documentar activación del modo coche para usuarios
