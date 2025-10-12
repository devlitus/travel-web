# Instrucciones para GitHub Copilot - Travel Web

## Contexto del Proyecto

Este es un proyecto de aplicación web de viajes construido con **Astro 5.x**, TypeScript y CSS vanilla. La aplicación permite buscar destinos de viaje y generar itinerarios personalizados.

## Tecnologías Principales

- **Framework**: Astro 5.x
- **Lenguaje**: TypeScript
- **Estilos**: CSS vanilla (scoped y global)
- **Deployment**: Estático (SSG)

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

### 4. Estilos Tailwind CSS

- Usar Tailwind CSS para estilos globales
- Clases utilitarias para componentes simples

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

### Búsqueda de Destinos

- Usar el componente `TravelForm` existente
- Integrar con la API de búsqueda en `/api/search`
- Mantener consistencia con los destinos existentes

### Generación de Itinerarios

- Páginas dinámicas en `/itinerary/[destination]`
- Usar los assets de imágenes existentes
- Mantener el estilo visual consistente

### Manejo de Estados

- Preferir URL state sobre JavaScript state
- Usar query parameters para filtros
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

- Destinos de viaje (París, Roma, Nueva York, etc.)
- Generación de itinerarios personalizados
- Búsqueda y filtrado de destinos
- Información turística y recomendaciones

Mantener siempre el contexto de viajes y turismo en las sugerencias y implementaciones.
