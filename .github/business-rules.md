# Travel Web - Reglas de Negocio y Especificaciones Técnicas

> **Última actualización**: 12 de octubre de 2025  
> **Versión**: MVP 1.0  
> **Stack**: Astro 5.x + Gemini AI + Tailwind CSS + Vercel

## 📌 Propósito de Este Documento

Este documento contiene **especificaciones técnicas y reglas de implementación**.

**Para visión, estrategia y roadmap**, consultar: [`project-briefing.md`](./project-briefing.md)

---

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

```json
{
  "framework": "Astro 5.14.4",
  "runtime": "Node.js",
  "language": "TypeScript 5.9.2",
  "styling": "Tailwind CSS 4.1.11",
  "ai": "Google Gemini AI 2.0 Flash (@google/genai 1.10.0)",
  "validation": "Zod (via @astrojs/check)",
  "images": "Unsplash API",
  "deployment": "Vercel (SSG + API Routes)"
}
```

### Tipo de Aplicación

- **SSG (Static Site Generation)** por defecto
- **API Routes** con runtime Node.js para endpoints dinámicos
- **Cache en memoria** para optimizar respuestas de IA

## 📝 Reglas del Formulario de Viaje

### Parámetros Obligatorios

Todos los campos del formulario son **obligatorios** y validados con **Zod Schema**:

1. **destination** (string)
   - Campo de texto libre
   - Mínimo: 1 carácter
   - Placeholder: "¿Dónde sueñas viajar? 🌍"
   - Acepta cualquier destino del mundo

2. **budget** (enum)
   - `low`: 💰 Económico
   - `medium`: 💰💰 Moderado
   - `high`: 💰💰💰 Premium

3. **duration** (enum)
   - `weekend`: 🌙 Fin de semana (2-3 días)
   - `1-week`: 🌙🌙 1 semana (5-7 días)
   - `2-weeks`: 🌙🌙🌙 2 semanas (10-14 días)
   - `month`: 🌙🌙🌙🌙 1 mes o más (30+ días)

4. **travelStyle** (enum)
   - `backpacking`: 🎒 Mochilero
   - `luxury`: 💎 Lujoso
   - `family`: 👨‍👩‍👧‍👦 Familiar
   - `adventure`: 🎢 Aventura

5. **accommodation** (enum)
   - `hotel`: 🏨 Hotel
   - `hostel`: 🏨 Hostal
   - `apartment`: 🏨 Apartamento
   - `resort`: 🏨 Resort

6. **season** (enum)
   - `summer`: 🌞 Verano
   - `winter`: ❄️ Invierno
   - `spring`: 🌸 Primavera
   - `autumn`: 🍂 Otoño

7. **activities** (array de strings)
   - Mínimo: 1 actividad seleccionada
   - Opciones disponibles:
     - Aventura
     - Playa
     - Cultura
     - Historia
     - Gastronomía
     - Naturaleza
     - Relax
     - Romance
     - Familia
     - Deportes

### Validación de Datos

```typescript
// Schema de validación con Zod
travelSchema = {
  destination: string().min(1, "El destino es requerido"),
  budget: enum(["low", "medium", "high"]),
  duration: enum(["weekend", "1-week", "2-weeks", "month"]),
  travelStyle: enum(["backpacking", "luxury", "family", "adventure"]),
  accommodation: enum(["hotel", "hostel", "apartment", "resort"]),
  season: enum(["summer", "winter", "spring", "autumn"]),
  activities: array(string()).min(1, "Selecciona al menos una actividad")
}
```

## 🤖 Reglas de Generación con IA

### Modelo de IA

- **Proveedor**: Google Gemini AI
- **Modelo**: `gemini-2.0-flash`
- **API**: `@google/genai` v1.10.0

### Configuración de Generación

- **Temperature**: 0.1 (alta precisión, baja creatividad)
- **maxOutputTokens**: 2048
- **candidateCount**: 1
- **System Instruction**: Template personalizado basado en preferencias del usuario

### Formato de Respuesta Esperado

La IA debe retornar un objeto JSON con la siguiente estructura:

```json
{
  "itinerary": {
    "destination": "string",
    "duration": "string",
    "budget": "string",
    "days": [
      {
        "day": 1,
        "title": "string",
        "activities": [
          {
            "time": "string",
            "title": "string",
            "description": "string",
            "location": "string",
            "estimatedCost": "string"
          }
        ]
      }
    ],
    "tips": ["string"],
    "estimatedBudget": "string"
  }
}
```

### Transformación de Respuesta

- Las respuestas en Markdown se transforman a JSON usando `transformMarkdownToJson()`
- Se eliminan bloques de código y formato markdown
- Se valida que la respuesta contenga la propiedad `itinerary`

## � Reglas de Cache

### Sistema de Cache en Memoria

- **Implementación**: `MemoryCache` class personalizada
- **TTL por defecto**: 3600 segundos (1 hora)
- **Almacenamiento**: Map en memoria del servidor

### Cache de Búsquedas

- **Clave de cache**: Hash MD5 de todos los parámetros del formulario
- **Tiempo de vida**: 1 hora (3600s)
- **Headers HTTP**:
  - `Cache-Control: public, max-age=3600`
  - `X-Cache: HIT` o `X-Cache: MISS`
  - `ETag` generado por hash de respuesta

### Generación de Cache Keys

```typescript
// Formato: search_{destination}_{budget}_{duration}_{style}_{accommodation}_{season}_{activities}
cacheKey = generateCacheKey("search", {
  destination,
  budget,
  duration,
  travelStyle,
  accommodation,
  season,
  activities,
});
```

### Invalidación de Cache

- **Automática**: Por TTL (expiración temporal)
- **Manual**: No implementada en MVP
- **Por deploy**: Cache se resetea con cada deploy

### Headers de Cache HTTP

**API Long Cache** (1 hora):

```
Cache-Control: public, max-age=3600, s-maxage=3600
Vary: Accept-Encoding
```

**Assets estáticos**:

- Hash en nombres de archivo para cache busting
- `assetFileNames: 'assets/[name].[hash][extname]'`
- `chunkFileNames: 'chunks/[name].[hash].js'`

## 📋 Reglas de Itinerarios

### Estructura de Páginas

- **Ruta**: `/itinerary/[destination]`
- **Tipo**: Página dinámica SSG
- **Pre-render**: Habilitado por defecto

### Contenido del Itinerario

El itinerario generado debe incluir:

1. **Información general**:
   - Nombre del destino
   - Duración del viaje
   - Presupuesto estimado

2. **Plan día por día**:
   - Número de día
   - Título descriptivo del día
   - Lista de actividades con horarios

3. **Por actividad**:
   - Hora de inicio
   - Título de la actividad
   - Descripción detallada
   - Ubicación específica
   - Costo estimado

4. **Tips y recomendaciones**:
   - Consejos generales
   - Mejores prácticas
   - Advertencias si aplica

### Imágenes de Destinos

- **Proveedor**: Unsplash API
- **Endpoint**: `/api/unsplash-image?query=[destination]`
- **Parámetros**:
  - orientation: landscape
  - per_page: 1
  - query: Nombre del destino
- **Fallback**: Imagen placeholder si falla la API

### Tiempos de Generación

- **Objetivo**: < 5 segundos para itinerario completo
- **Con cache**: < 500ms
- **Sin cache**: 2-5 segundos (llamada a Gemini AI)

## 📝 Reglas de Contenido

### Idioma

- **Idioma principal**: Español
- **Formato de textos**: UTF-8
- **Soporte i18n**: No implementado en MVP

### Tono y Estilo

- **Tono**: Inspirador, cercano, informativo
- **Formato**: Markdown convertido a JSON
- **Emoji**: Permitidos y recomendados en UI

### Calidad del Contenido Generado

- **Precisión**: Dependiente de Gemini AI
- **Verificación**: No hay validación manual en MVP
- **Actualización**: Contenido se regenera en cada petición (sin cache)

## ⚡ Reglas de Performance

### Tiempos de Carga Objetivo

- **Página inicial**: < 2 segundos (LCP)
- **Páginas de itinerario**: < 3 segundos
- **API de búsqueda (sin cache)**: 2-5 segundos
- **API de búsqueda (con cache)**: < 500ms

### Optimización de Build

- **Compresión HTML**: Habilitada (`compressHTML: true`)
- **Minificación**: esbuild para JS, nativo para CSS
- **Code splitting**: Automático por Astro
- **Inline styles**: Modo `auto` (inline solo críticos)

### Límites de Bundle

- **JavaScript total**: No limitado actualmente
- **Dependencias**: Solo las necesarias (@google/genai, tailwindcss, zod)
- **Tree shaking**: Habilitado por Vite

### Optimización de Assets

- **Cache busting**: Hash automático en nombres de archivo
- **Lazy loading**: Implementar según necesidad
- **Image optimization**: Manual (no hay plugin de imágenes)

## 🌐 Reglas de Accesibilidad

### Estándares Objetivo

- **WCAG 2.1**: Nivel AA como objetivo (no auditado)
- **Semántica HTML5**: Estructura correcta de headings
- **Navegación por teclado**: Funcional en formularios

### Elementos Accesibles

- **Formularios**: Labels asociados correctamente
- **Botones**: Texto descriptivo
- **Iconos**: Uso decorativo con SVG inline
- **Contraste**: Verificar con herramientas manuales

### Pendientes de Implementación

- [ ] Alt text en imágenes de Unsplash
- [ ] Atributos ARIA en componentes interactivos
- [ ] Skip to content link
- [ ] Focus visible personalizado

## � Reglas de SEO

### Estructura de URLs

**Implementadas**:

- `/`: Página principal
- `/itinerary/[destination]`: Página de itinerario dinámico

**No implementadas** (futuro):

- `/destino/[nombre-destino]`: Páginas de destinos estáticos
- `/buscar?q=[termino]`: Página de búsqueda
- `/categoria/[nombre-categoria]`: Páginas por categoría

### Meta Tags

- **Layout global**: `Layout.astro` contiene meta tags base
- **Title**: Personalizable por página
- **Description**: Definir por página
- **Open Graph**: Implementar según necesidad
- **Favicon**: Configurar en `public/`

### Generación de Contenido

- **SSG**: Páginas estáticas por defecto
- **Dynamic routes**: `/itinerary/[destination]` genera HTML estático
- **Sitemap**: No implementado
- **Robots.txt**: No configurado

### Structured Data

- **Schema.org**: No implementado en MVP
- **JSON-LD**: Pendiente de implementar para itinerarios

## 🔒 Reglas de Seguridad

### Variables de Entorno

- **GEMINI_API_KEY**: Obligatoria, solo server-side
- **Storage**: En `.env` (no commiteado)
- **Validación**: Verificar existencia al iniciar API

### Protección de APIs

- **API Key**: No expuesta al cliente
- **CORS**: Configurar según necesidad
- **Rate limiting**: No implementado en MVP
- **Sanitización**: Validación con Zod schema

### Datos del Usuario

- **No persistencia**: No se almacenan datos de usuario
- **No cookies**: Solo las esenciales del framework
- **No tracking**: No hay analytics en MVP
- **HTTPS**: Obligatorio en producción (Vercel)

### Validación de Entrada

```typescript
// Todas las entradas validadas con Zod
- Tipo de datos correcto
- Valores dentro de enums permitidos
- Arrays con mínimo de elementos
- Strings no vacíos cuando son requeridos
```

## 📱 Reglas de Responsive Design

### Framework de Estilos

- **Tailwind CSS**: v4.1.11
- **Plugin**: @tailwindcss/vite v4.1.11
- **Configuración**: Mínima, usando defaults

### Breakpoints (Tailwind defaults)

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Clases Responsive Comunes

```css
/* Formulario */
.grid-cols-1 md:grid-cols-2  /* 1 columna móvil, 2 en tablet+ */

/* Espaciado */
.p-7              /* Padding consistente */
.gap-10           /* Gap entre elementos del grid */
.max-w-4xl        /* Ancho máximo contenedor */
```

### Adaptación de Contenido

- **Formulario**: 1 columna en móvil, 2 columnas en tablet+
- **Botones**: Full width en móvil, auto en desktop
- **Texto**: Tamaños responsive con Tailwind
- **Imágenes**: Responsive por naturaleza (sin optimización adicional)

## 🚫 Restricciones y Limitaciones Actuales

### Restricciones Técnicas

- **Navegadores**: Modernos con soporte ES2020+
- **JavaScript requerido**: Sí (para formulario y navegación)
- **Dependencias externas**:
  - @google/genai (Gemini AI)
  - @astrojs/vercel (Deployment)
  - tailwindcss (Estilos)
  - zod (Validación)
- **Bundle size**: No monitoreado activamente

### Restricciones de Contenido

- **Idioma**: Solo español
- **Destinos**: Sin límite (generados por IA)
- **Calidad**: Dependiente de Gemini AI
- **Moderación**: Sin sistema de moderación

### Restricciones de Escalabilidad

- **Cache en memoria**: Se resetea con cada deploy
- **Sin base de datos**: No hay persistencia
- **Sin usuarios**: No hay autenticación
- **Sin rate limiting**: Vulnerable a abuso
- **Costo de API**: Cada búsqueda sin cache consume tokens de Gemini

### Limitaciones del MVP

- ❌ No hay búsqueda de destinos preexistentes
- ❌ No hay sistema de favoritos
- ❌ No hay compartir itinerarios
- ❌ No hay exportar a PDF
- ❌ No hay mapa interactivo
- ❌ No hay sistema de reviews
- ❌ No hay integración con booking
- ❌ No hay versión multi-idioma

## 📈 Métricas y Monitoreo

### Estado Actual: No Implementado

Las métricas de producto están definidas en [`project-briefing.md`](./project-briefing.md).

**Actualmente disponible**:

- Vercel Analytics (básico)
- Logs de servidor en Vercel Dashboard
- Cache hits/misses via header `X-Cache`

**Métricas técnicas objetivo**:

- Lighthouse Score: > 85
- LCP: < 2.5s, FID: < 100ms, CLS: < 0.1

---

## 🔧 Reglas de Desarrollo

### Stack Tecnológico

```json
{
  "framework": "Astro 5.14.4",
  "runtime": "Node.js",
  "language": "TypeScript 5.9.2",
  "styling": "Tailwind CSS 4.1.11",
  "ai": "Google Gemini 2.0 Flash",
  "validation": "Zod (via @astrojs/check)",
  "deployment": "Vercel (SSG)"
}
```

### Estructura de Archivos

```
src/
├── assets/images/          # Imágenes estáticas
├── components/             # Componentes Astro reutilizables
│   ├── Header/
│   └── TravelForm/        # Formulario principal
├── layouts/               # Layouts de página
│   └── Layout.astro       # Layout principal
├── pages/                 # File-based routing
│   ├── index.astro        # Página principal
│   ├── api/              # API endpoints
│   │   ├── search.ts     # Búsqueda con Gemini
│   │   └── unsplash-image.ts
│   └── itinerary/
│       └── [destination].astro
├── styles/               # Estilos globales
├── utils/                # Utilidades y helpers
└── env.d.ts             # TypeScript definitions
```

### Convenciones de Código

**Componentes Astro**:

- PascalCase para nombres de archivo
- Props tipadas con interfaces TypeScript
- Estilos scoped por defecto

**Utilidades**:

- camelCase para funciones
- Exportación nombrada preferida
- Documentación con JSDoc

**CSS/Tailwind**:

- Preferir utility classes de Tailwind
- CSS custom solo cuando sea necesario
- Nombres de clase en kebab-case

### Comandos Disponibles

```bash
npm run dev      # Desarrollo local (puerto 4321)
npm run build    # Build para producción
npm run preview  # Preview del build local
npm run astro    # CLI de Astro
```

## � Reglas de Deployment

### Plataforma

- **Hosting**: Vercel
- **Adapter**: @astrojs/vercel v8.2.9
- **Tipo**: Static Site Generation (SSG)
- **Runtime**: Node.js (para API routes)

### Proceso de Deploy

1. Push a rama `main` o `develop`
2. Vercel detecta cambios automáticamente
3. Build automático con `npm run build`
4. Deploy automático si build exitoso
5. Cache de build en Vercel

### Variables de Entorno en Vercel

```
GEMINI_API_KEY=<tu-api-key>
```

**Importante**: Configurar en Vercel Dashboard → Settings → Environment Variables

### Dominios y URLs

- **Producción**: [tu-dominio].vercel.app
- **Preview**: URLs únicas por branch/PR
- **Local**: http://localhost:4321

### Optimizaciones de Build

- Compresión HTML habilitada
- Assets con hash para cache busting
- Tree shaking automático
- CSS minificado

## 📚 Reglas de Documentación

### Archivos de Documentación

- `README.md`: Introducción y setup del proyecto
- `.github/copilot-instructions.md`: Instrucciones para GitHub Copilot
- `.github/instructions/*.md`: Instrucciones específicas por tipo de archivo
- `CACHE_SYSTEM.md`: Documentación del sistema de cache
- Este archivo: Reglas de negocio

### Comentarios en Código

- **JSDoc**: Para funciones públicas y utilidades
- **Inline comments**: Solo cuando la lógica no es obvia
- **TODO comments**: Marcar funcionalidad pendiente

### Mantenimiento

- **Actualización de docs**: Con cada feature nueva
- **Revisión**: Al hacer cambios arquitectónicos
- **Versioning**: Fecha de última actualización en headers

## � Checklist de Implementación

### ✅ Implementado (v1.0 MVP)

- [x] Formulario con validación Zod (7 parámetros)
- [x] Integración con Gemini AI 2.0 Flash
- [x] Cache en memoria con TTL
- [x] Generación de itinerarios dinámicos
- [x] Páginas estáticas con SSG (Astro)
- [x] Deployment en Vercel
- [x] Responsive design con Tailwind CSS
- [x] TypeScript en todo el proyecto
- [x] API de imágenes con Unsplash

### ⏳ Pendiente (Backlog Técnico)

- [ ] Rate limiting en APIs
- [ ] Monitoreo de errores (Sentry)
- [ ] Analytics de usuarios (Google Analytics)
- [ ] Tests unitarios e integración
- [ ] Lighthouse CI en pipeline
- [ ] Sitemap.xml y robots.txt
- [ ] Open Graph meta tags completos
- [ ] Accesibilidad auditada (WCAG AA)
- [ ] Optimización automática de imágenes
- [ ] Internacionalización (i18n)

**Para roadmap de producto y features**, ver [`project-briefing.md`](./project-briefing.md)

---

## 📞 Referencias

**Documentación relacionada**:

- 📋 [`project-briefing.md`](./project-briefing.md) - Visión, estrategia y roadmap
- 💻 [`copilot-instructions.md`](./copilot-instructions.md) - Guía de desarrollo
- 📦 [`CACHE_SYSTEM.md`](../CACHE_SYSTEM.md) - Sistema de cache detallado

**Repository**: github.com/devlitus/travel-web  
**Branch**: develop  
**Última revisión**: 12 de octubre de 2025
