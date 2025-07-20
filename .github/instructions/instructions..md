---
applyTo: "**"
---

# Guía de Desarrollo para Astro - Travel Web

## Contexto del Proyecto

Este es un proyecto de aplicación web de viajes construido con Astro, que incluye funcionalidades para buscar destinos y generar itinerarios de viaje.

## Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos (imágenes, iconos)
├── components/      # Componentes reutilizables de Astro
├── layouts/         # Plantillas de layout
├── pages/           # Páginas y rutas de la aplicación
├── styles/          # Estilos CSS globales
└── utils/           # Utilidades y helpers
```

## Pautas de Desarrollo

### 1. Componentes Astro (.astro)

- Usar la sintaxis de componentes de Astro con frontmatter y template
- Preferir componentes server-side por defecto
- Usar `client:*` directivas solo cuando sea necesario para interactividad
- Organizar componentes en carpetas por funcionalidad

**Ejemplo de estructura de componente:**

```astro
---
// Frontmatter (JavaScript/TypeScript)
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!-- Template HTML -->
<div class="component">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>

<style>
  .component {
    /* Estilos scoped */
  }
</style>
```

### 2. Páginas y Rutas

- Usar file-based routing de Astro
- Páginas dinámicas con `[parametro].astro`
- APIs en `pages/api/` para endpoints del servidor
- Usar `getStaticPaths()` para rutas dinámicas cuando sea necesario

### 3. Estilos CSS

- Preferir CSS scoped en componentes cuando sea posible
- Usar `global.css` para estilos generales
- Crear archivos CSS específicos para páginas complejas
- Mantener consistencia en naming conventions

### 4. Manejo de Assets

- Imágenes optimizadas en `src/assets/`
- Usar `import` para referenciar assets
- Aprovechar las optimizaciones automáticas de Astro

### 5. TypeScript

- Usar TypeScript para mejor type safety
- Definir interfaces para Props de componentes
- Usar tipos específicos para APIs y datos

### 6. APIs y Datos

- Endpoints de API en `pages/api/`
- Usar `Astro.request` para manejar requests
- Retornar respuestas JSON apropiadas
- Manejar errores correctamente

### 7. Mejores Prácticas

- **Performance**: Minimizar JavaScript del lado del cliente
- **SEO**: Usar meta tags apropiados en layouts
- **Accesibilidad**: Incluir atributos ARIA y estructura semántica
- **Responsividad**: Diseñar mobile-first
- **Optimización**: Aprovechar el pre-rendering de Astro

### 8. Convenciones de Naming

- Componentes: PascalCase (ej: `TravelForm.astro`)
- Archivos: kebab-case para páginas (ej: `travel-results.astro`)
- CSS classes: kebab-case o BEM
- Variables: camelCase

### 9. Estructura de Directorios

- Agrupar archivos relacionados en carpetas
- Usar `index.astro` para páginas principales
- Separar utilities en `src/utils/`
- Mantener assets organizados por tipo

### 10. Interactividad

- Usar `client:load` para componentes que necesitan hidratación inmediata
- Usar `client:idle` para componentes menos críticos
- Preferir `client:visible` para componentes below-the-fold
- Minimizar el uso de frameworks JavaScript cuando sea posible

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview

# Linting (si está configurado)
npm run lint
```

## Consideraciones Específicas del Proyecto

- Este proyecto maneja destinos de viaje y generación de itinerarios
- Usar las imágenes existentes en `src/assets/images/`
- Mantener consistencia con el diseño actual
- Considerar la funcionalidad de búsqueda existente
