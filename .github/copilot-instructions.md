# Instrucciones para GitHub Copilot - Travel Web

## 🎯 Propósito de Este Documento

Guía de desarrollo con **convenciones de código, patrones y mejores prácticas** específicas para este proyecto.

**Para otras referencias**:
- 📋 [Business Rules](./business-rules.md) - Especificaciones técnicas detalladas
- 📋 [Project Briefing](./project-briefing.md) - Visión y estrategia del producto

---

## Contexto del Proyecto

Aplicación web de generación de itinerarios de viaje construida con **Astro 5.x**, **Gemini AI** y **Tailwind CSS**. Genera itinerarios personalizados usando IA basándose en preferencias del usuario.

## Stack Tecnológico

- **Framework**: Astro 5.14.4 (SSG + API Routes)
- **Lenguaje**: TypeScript 5.9.2
- **Estilos**: Tailwind CSS 4.1.11
- **IA**: Google Gemini 2.0 Flash
- **Validación**: Zod
- **Deployment**: Vercel

## Reglas de Codificación

### 1. Componentes Astro

- SIEMPRE usar la estructura: frontmatter + template + styles
- Preferir componentes server-side por defecto
- Solo usar `client:*` cuando sea absolutamente necesario
- Definir interfaces TypeScript para todas las Props

```astro
---
interface Props {
  title: string;
  optional?: boolean;
}
const { title, optional = false } = Astro.props;
---

<div class="component">
  <h2>{title}</h2>
</div>

<style>
  .component { /* estilos scoped */ }
</style>
```

### 2. Estructura de Archivos

- Componentes en `src/components/[NombreComponente]/`
- Cada componente principal en su propia carpeta
- Archivos CSS separados solo para componentes complejos
- Páginas siguen file-based routing en `src/pages/`

### 3. Naming Conventions

- **Componentes**: PascalCase (ej: `TravelForm.astro`)
- **Páginas**: kebab-case (ej: `travel-results.astro`)
- **Archivos**: kebab-case para todo excepto componentes
- **CSS classes**: kebab-case o BEM
- **Variables**: camelCase en JS/TS, kebab-case en CSS

### 4. Estilos con Tailwind CSS

- **Preferir utility classes** de Tailwind para todo lo posible
- CSS custom solo cuando sea absolutamente necesario
- Usar clases responsive: `md:`, `lg:`, etc.
- Aprovechar el sistema de espaciado: `p-4`, `gap-6`, `mt-8`

### 5. TypeScript

- Definir interfaces para todos los Props
- Usar tipos específicos, evitar `any`
- Importar tipos con `import type`
- Validar datos de APIs

### 6. Manejo de Assets

- Imágenes en `src/assets/images/`
- Usar `import` para referenciar assets
- Optimizar imágenes antes de commit
- Usar alt text descriptivo

### 7. APIs y Datos

- Endpoints en `src/pages/api/`
- Usar `Astro.request` para manejar requests
- Retornar `Response` con JSON apropiado
- Manejar errores con status codes correctos

```typescript
export async function GET({ request }: { request: Request }) {
  try {
    // lógica
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

### 8. Interactividad

- Minimizar JavaScript del lado del cliente
- Usar `client:load` solo para componentes críticos
- Preferir `client:idle` para componentes secundarios
- Usar `client:visible` para componentes below-the-fold
- Considerar `client:media` para responsive behavior

### 9. Performance

- Aprovechar el pre-rendering de Astro
- Minimizar el bundle de JavaScript
- Usar lazy loading para imágenes
- Optimizar CSS crítico

### 10. SEO y Accesibilidad

- Incluir meta tags apropiados en layouts
- Usar estructura semántica HTML5
- Incluir atributos ARIA cuando sea necesario
- Asegurar contraste de colores adecuado
- Navegación por teclado funcional

## Patrones Específicos del Proyecto

### Formulario de Preferencias

- Usar el componente `TravelForm` con sus 7 parámetros
- Validar con el schema Zod definido en `/api/search.ts`
- Mantener consistencia en labels e iconos

### Generación de Itinerarios con IA

- Endpoint principal: `/api/search` (POST)
- Usa Gemini AI 2.0 Flash con temperatura 0.1
- Respuestas cacheadas por 1 hora
- Páginas dinámicas en `/itinerary/[destination]`

### Sistema de Cache

- Usar `MemoryCache` para almacenar respuestas de IA
- TTL por defecto: 3600 segundos (1 hora)
- Generar cache keys con `generateCacheKey()`
- Incluir headers `X-Cache: HIT/MISS` en responses

### Manejo de Estados

- Preferir URL state sobre JavaScript state
- Usar `Astro.params` para rutas dinámicas
- Mantener navegación bookmarkeable

## Comandos y Scripts

```bash
npm run dev          # Desarrollo
npm run build        # Producción
npm run preview      # Preview local
npm run check        # Type checking
```

## Debugging

- Usar `console.log` en frontmatter para debugging
- Verificar tipos con `astro check`
- Usar DevTools para CSS debugging

## NO HACER

- ❌ No usar React, Vue u otros frameworks sin justificación
- ❌ No crear JavaScript innecesario del lado del cliente
- ❌ No usar `any` en TypeScript
- ❌ No ignorar errores de tipo
- ❌ No crear estilos globales innecesarios
- ❌ No usar `client:load` por defecto

## SÍ HACER

- ✅ Aprovechar el server-side rendering de Astro
- ✅ Usar TypeScript para type safety
- ✅ Mantener componentes simples y reutilizables
- ✅ Optimizar para performance
- ✅ Seguir principios de accesibilidad
- ✅ Escribir código limpio y mantenible

## Contexto de Dominio

Este proyecto maneja:

- **Generación de itinerarios con IA**: Cualquier destino del mundo
- **Personalización**: 7 parámetros + actividades seleccionables
- **Preferencias de viaje**: Presupuesto, duración, estilo, alojamiento, temporada
- **Actividades**: Aventura, Playa, Cultura, Historia, Gastronomía, Naturaleza, Relax, Romance, Familia, Deportes

Mantener siempre el contexto de viajes y turismo en las sugerencias y implementaciones.

---

## 📚 Documentación Relacionada

- 📋 [business-rules.md](./business-rules.md) - Especificaciones técnicas y reglas de validación
- 📋 [project-briefing.md](./project-briefing.md) - Visión, estrategia y roadmap del producto
- 📦 [CACHE_SYSTEM.md](../CACHE_SYSTEM.md) - Documentación del sistema de cache
