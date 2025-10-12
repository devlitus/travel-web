# Assets del Proyecto

Esta carpeta contiene imágenes y recursos para la documentación.

## Screenshots

### `screenshot.png`

**Cómo crear el screenshot:**

1. **Abre tu aplicación** en el navegador:

   ```bash
   npm run dev
   ```

2. **Navega** a `http://localhost:4321`

3. **Captura el screenshot**:
   - **Windows**: Win + Shift + S (Snipping Tool)
   - **Mac**: Cmd + Shift + 4
   - **Linux**: Gnome Screenshot o Spectacle

4. **Dimensiones recomendadas**:
   - Ancho: 1200px - 1400px
   - Alto: 700px - 900px
   - Formato: PNG (mejor calidad)

5. **Qué capturar**:
   - Formulario completo de preferencias
   - Con los 7 campos visibles
   - Sección de actividades visible
   - Botón "Crear Mi Aventura Perfecta" visible
   - Sin scrollbar visible (página centrada)

6. **Optimizar la imagen** (opcional):
   - Usa TinyPNG: https://tinypng.com/
   - O comprime con: `npm install -g sharp-cli && sharp -i screenshot.png -o screenshot.png`

7. **Guarda como**: `screenshot.png` en esta carpeta

### Alternativa: Screenshot Automático

Si prefieres usar un script automatizado:

```bash
# Instalar Playwright
npm install -D @playwright/test

# Crear script de screenshot (screenshot.js)
# Ver ejemplo en la documentación de Playwright
```

## Otros Assets

- Logos del proyecto
- Iconos personalizados
- Imágenes de marketing
- Diagramas de arquitectura
