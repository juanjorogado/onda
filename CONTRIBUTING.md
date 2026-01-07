# Guía de Contribución

¡Gracias por tu interés en contribuir a ONDA Radio! 🎉

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor:

1. Verifica que no haya un issue abierto ya sobre el mismo problema
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs. comportamiento actual
   - Información del entorno (navegador, OS, versión)

### Sugerir Nuevas Características

Las sugerencias son bienvenidas:

1. Abre un issue con la etiqueta `enhancement`
2. Describe la característica y su caso de uso
3. Explica por qué sería útil para otros usuarios

### Contribuir con Código

1. **Fork el repositorio**
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```
3. **Haz tus cambios** siguiendo las convenciones del proyecto:
   - Usa TypeScript
   - Sigue el estilo de código existente
   - Añade comentarios cuando sea necesario
   - Actualiza la documentación si es necesario
4. **Prueba tus cambios**:
   ```bash
   npm run build
   npm run lint
   ```
5. **Commit tus cambios**:
   ```bash
   git commit -m "feat: añadir nueva característica"
   ```
   Usa mensajes de commit descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
6. **Push a tu fork**:
   ```bash
   git push origin feature/mi-nueva-caracteristica
   ```
7. **Abre un Pull Request** desde tu fork hacia `main`

## Convenciones de Código

### Estilo

- Usa TypeScript para todo el código nuevo
- Sigue las reglas de ESLint configuradas
- Usa nombres descriptivos para variables y funciones
- Comenta código complejo o no obvio

### Estructura de Archivos

- Componentes en `src/components/`
- Hooks personalizados en `src/hooks/`
- Servicios en `src/services/`
- Utilidades en `src/utils/`
- Tipos TypeScript en `src/types/`
- Estilos globales en `src/styles/`

### Commits

Usa mensajes de commit descriptivos:

- `feat:` para nuevas características
- `fix:` para correcciones de bugs
- `docs:` para cambios en documentación
- `style:` para cambios de formato
- `refactor:` para refactorización de código
- `test:` para añadir o modificar tests
- `chore:` para tareas de mantenimiento

Ejemplo:
```
feat: añadir animación de swipe tipo carta
fix: corregir marquee que se cortaba
docs: actualizar README con nuevas características
```

## Configuración del Entorno de Desarrollo

1. Clona el repositorio:
   ```bash
   git clone https://github.com/juanjorogado/onda.git
   cd onda
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Configura variables de entorno (opcional):
   - Crea un archivo `.env` en la raíz del proyecto
   - Consulta `docs/ENV_SETUP.md` para más información

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Preguntas

Si tienes preguntas, puedes:
- Abrir un issue con la etiqueta `question`
- Revisar la documentación en `docs/`

## Código de Conducta

Este proyecto sigue el [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Al participar, te comprometes a mantener este código.

¡Gracias por contribuir! 🎵
