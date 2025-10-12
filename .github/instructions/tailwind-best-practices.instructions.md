---
applyTo: '**.{astro,css}**'
---
# Mejores Prácticas para Tailwind CSS v4

Este documento contiene las mejores prácticas y recomendaciones para escribir código eficiente y mantenible con Tailwind CSS v4.

## Configuración y Configuración Inicial con Astro

### Instalación con Astro CLI

La forma recomendada de instalar Tailwind CSS v4 en un proyecto Astro es usando el CLI de Astro:

```bash
# Usando npm
npx astro add tailwind

# Usando pnpm
pnpm astro add tailwind

# Usando yarn
yarn astro add tailwind
```

Este comando automáticamente:
- Instala Tailwind CSS v4 y el plugin de Vite
- Configura `astro.config.mjs` con la integración
- Crea el archivo `tailwind.config.mjs` si no existe
- Crea o actualiza `src/styles/global.css` con el import de Tailwind

### Configuración Manual

Si prefieres una instalación manual:

```bash
# Instalar Tailwind CSS v4
npm install tailwindcss@next
```

### Configuración de Astro

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // La integración de Tailwind se agrega automáticamente con `astro add tailwind`
  // No se requiere configuración adicional para Tailwind v4
  vite: {
    // Tailwind v4 funciona automáticamente con Vite en Astro
  }
});
```

### Configuración de Tailwind

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Importación en CSS Global

```css
/* src/styles/global.css */
@import "tailwindcss";
```

### Importación en Layout de Astro

```astro
---
// src/layouts/Layout.astro
import "../styles/global.css";
---

<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Mi Sitio Astro</title>
</head>
<body>
  <slot />
</body>
</html>
```

## Optimización de Rendimiento

### Hardware Acceleration

Usa `transform-gpu` para animaciones complejas:

```html
<div class="scale-150 transform-gpu transition-transform">
  <!-- Contenido animado -->
</div>
```

### Will Change Utilities

Optimiza animaciones con `will-change` utilities:

```html
<div class="overflow-auto will-change-scroll">
  <!-- Contenido con scroll optimizado -->
</div>

<!-- Aplica solo antes del cambio y remueve después -->
<div class="will-change-transform hover:scale-110">
  <!-- Elemento que será animado -->
</div>
```

### Evita el Overuse de Utilities

No apliques `will-change` indiscriminadamente:

```html
<!-- ❌ Mal - exceso de optimización -->
<div class="will-change-transform will-change-opacity">
  <!-- Contenido -->
</div>

<!-- ✅ Bien - aplicado solo cuando es necesario -->
<div class="will-change-transform hover:scale-110">
  <!-- Elemento específico para animar -->
</div>
```

## Organización del Código

### Estructura de Componentes

Mantén las clases organizadas y agrupadas por función:

```html
<!-- ✅ Bueno - clases agrupadas lógicamente -->
<div class="
  /* Layout */
  flex flex-col space-y-4
  /* Spacing */
  p-6 m-4
  /* Typography */
  text-lg font-medium text-gray-900
  /* Colors */
  bg-white border border-gray-200 rounded-lg
  /* States */
  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
">
  <!-- Contenido -->
</div>
```

### Nomenclatura Consistente

Usa un patrón consistente para nombrar clases personalizadas:

```css
/* ✅ Bueno - nombres descriptivos */
@utility card-container {
  @apply bg-white rounded-lg shadow-md p-6;
}

@utility button-primary {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}

/* ❌ Evito - nombres genéricos */
@utility box {
  @apply bg-white p-4;
}
```

## Componentes y Reutilización

### Custom Utilities con @utility

En v4, usa `@utility` en lugar de `@layer`:

```css
/* ✅ v4 - sintaxis correcta */
@utility btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ButtonFace;
}

@utility tab-4 {
  tab-size: 4;
}

/* ❌ v3 - sintaxis obsoleta */
@layer components {
  .btn {
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: ButtonFace;
  }
}
```

### Componentes Reutilizables

Crea componentes con variantes consistentes:

```html
<!-- Botón primario -->
<button class="btn bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
  Primary
</button>

<!-- Botón secundario -->
<button class="btn bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500">
  Secondary
</button>
```

## Diseño Responsivo

### Mobile-First Approach

Usa siempre mobile-first:

```html
<!-- ✅ Mobile-first -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Contenido -->
</div>

<!-- ❌ Desktop-first (evitar) -->
<div class="w-1/3 md:w-1/2 lg:w-full">
  <!-- Contenido -->
</div>
```

### Container Queries

Aprovecha las container queries en v4:

```html
<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3">
    <!-- Contenido responsivo al contenedor -->
  </div>
</div>
```

## Estados y Variantes

### Variant Stacking

En v4, el orden de las variantes es izquierda-a-derecha:

```html
<!-- ✅ v4 - orden correcto -->
<ul class="py-4 *:first:pt-0 *:last:pb-0">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- ❌ v3 - orden obsoleto -->
<ul class="py-4 first:*:pt-0 last:*:pb-0">
  <!-- Contenido -->
</ul>
```

### Composable Variants

Aprovecha las nuevas variantes componibles:

```html
<div class="group">
  <div class="group-has-[&:focus]:opacity-100 group-focus:opacity-75">
    <!-- Elemento que responde a múltiples estados -->
  </div>
</div>
```

### Hover en Mobile

Configura el hover para dispositivos táctiles:

```css
/* Para mantener comportamiento v3 en dispositivos táctiles */
@custom-variant hover (&:hover);
```

## Accesibilidad

### Focus Management

Usa las nuevas utilidades de outline:

```html
<!-- ✅ v4 - sintaxis correcta -->
<input class="outline-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500" />

<!-- ❌ v3 - sintaxis obsoleta -->
<input class="focus:outline-none focus:ring-2 focus:ring-blue-500" />
```

### Contraste y Legibilidad

Asegura buen contraste:

```html
<!-- ✅ Buen contraste -->
<div class="bg-gray-900 text-white">
  <!-- Contenido -->
</div>

<!-- ✅ Con estados accesibles -->
<button class="bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-800 focus:ring-2 focus:ring-blue-300">
  Botón accesible
</button>
```

## CSS Variables y Arbitrary Values

### Sintaxis de Variables

En v4, usa paréntesis para variables CSS:

```html
<!-- ✅ v4 - sintaxis correcta -->
<div class="bg-(--brand-color) text-(--text-primary)">
  <!-- Contenido -->
</div>

<!-- ❌ v3 - sintaxis obsoleta -->
<div class="bg-[--brand-color] text-[--text-primary]">
  <!-- Contenido -->
</div>
```

### Dynamic Values

Aprovecha los valores dinámicos sin configuración:

```html
<!-- Grid personalizado sin configuración -->
<div class="grid grid-cols-15 gap-4">
  <!-- 15 columnas -->
</div>

<!-- Data attributes -->
<div data-current class="opacity-75 data-current:opacity-100">
  <!-- Elemento que responde a data attributes -->
</div>
```

## Migration desde v3

### Herramienta Automática

Usa la herramienta oficial de migración:

```bash
npx @tailwindcss/upgrade
```

### Cambios Clave

#### Ring Utilities

```html
<!-- v3 -->
<div class="ring ring-blue-500">

<!-- v4 (default width changed to 1px) -->
<div class="ring ring-blue-500">

<!-- Para mantener 3px -->
<div class="ring-3 ring-blue-500">
```

#### Shadow y Blur

```html
<!-- v3 → v4 -->
shadow-sm → shadow-xs
shadow → shadow-sm
shadow-md → shadow-sm
shadow-lg → shadow-md
shadow-xl → shadow-lg
```

#### Outline

```html
<!-- v3 → v4 -->
outline-none → outline-hidden
outline-2 → outline-2
```

### @apply en Componentes

Para Vue/Svelte/CSS Modules:

```html
<style>
  /* Opción 1: Usar @reference */
  @reference "../../app.css";
  
  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>

<style>
  /* Opción 2: Usar variables directamente */
  h1 {
    color: var(--text-red-500);
  }
</style>
```

## Best Practices Summary

### ✅ Hacer

- Usar `npx astro add tailwind` para instalación automática
- Aprovechar el pre-rendering de Astro con Tailwind
- Crear componentes reutilizables con interfaces TypeScript
- Usar layouts consistentes con Tailwind
- Aplicar mobile-first approach
- Agrupar clases lógicamente en componentes Astro
- Aprovechar las nuevas variantes componibles de v4
- Usar `@utility` para clases personalizadas
- Optimizar animaciones con `transform-gpu` y `will-change`
- Mantener consistencia en la nomenclatura
- Priorizar la accesibilidad
- Usar CSS scoped solo cuando sea necesario

### ❌ Evitar

- Overuse de `will-change` utilities
- Usar sintaxis obsoleta de v3
- Ignorar el orden de variantes en v4
- Crear componentes demasiado específicos
- Olvidar el contraste en colores
- Usar desktop-first approach
- Anidar layouts innecesariamente
- Ignorar las optimizaciones de Astro

### 🚀 Recomendaciones Astro + Tailwind

- **Componentes**: Crea componentes `.astro` reutilizables con interfaces TypeScript
- **Layouts**: Usa layouts consistentes con clases de Tailwind
- **Performance**: Aprovecha el SSG de Astro + utilidades de Tailwind
- **Responsive**: Aplica mobile-first con breakpoints de Tailwind
- **Estilos**: Usa Tailwind para la mayoría de estilos, CSS scoped solo para casos específicos
- **Imágenes**: Combina `<Image>` de Astro con clases de Tailwind
- **Tipografía**: Usa plugins como `@tailwindcss/typography` para contenido Markdown

## Herramientas Útiles

### Comandos de Astro CLI

```bash
# Agregar Tailwind a un proyecto existente
npx astro add tailwind

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

### Herramientas de Desarrollo

```bash
# Generar archivo de configuración de Tailwind (si no existe)
npx tailwindcss init

# Migración automática desde v3 (si vienes de v3)
npx @tailwindcss/upgrade
```

### Extensiones de VS Code Recomendadas

- **Astro** - Soporte oficial para archivos `.astro`
- **Tailwind CSS IntelliSense** - Autocompletado y sugerencias
- **Tailwind Docs** - Documentación integrada
- **Headwind** - Organiza clases automáticamente

### Configuración de Prettier para Astro + Tailwind

```json
// .prettierrc
{
  "plugins": [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss"
  ],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

### Integración con Preprocesadores

Astro soporta preprocesadores CSS con Tailwind:

```bash
# Instalar Sass/SCSS
npm install -D sass

# Instalar Less
npm install -D less

# Instalar Stylus
npm install -D stylus
```

```astro
---
// Ejemplo usando SCSS con Tailwind
---
<style lang="scss">
  .mi-componente {
    @apply bg-blue-500 text-white p-4 rounded-lg;
    
    &:hover {
      @apply bg-blue-600;
    }
  }
</style>
```

## Buenas Prácticas Específicas de Astro

### Componentes Astro con Tailwind

Crea componentes reutilizables con Tailwind:

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

const { title, description, variant = 'default' } = Astro.props;

const variantClasses = {
  default: 'bg-white border-gray-200',
  primary: 'bg-blue-50 border-blue-200',
  secondary: 'bg-gray-50 border-gray-300'
};
---

<div class={`border rounded-lg p-6 shadow-sm ${variantClasses[variant]}`}>
  <h3 class="text-lg font-semibold mb-2">{title}</h3>
  {description && <p class="text-gray-600">{description}</p>}
  <slot />
</div>

<style>
  /* Estilos específicos del componente si son necesarios */
</style>
```

### Layouts con Tailwind

Usa layouts consistentes con Tailwind:

```astro
---
// src/layouts/MainLayout.astro
import '../styles/global.css';
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<html lang="es" class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content="Sitio web con Astro y Tailwind CSS" />
  </head>
  <body class="min-h-screen bg-gray-50 text-gray-900">
    <header class="bg-white shadow-sm border-b">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Navigation content -->
      </nav>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
    
    <footer class="bg-gray-800 text-white mt-16">
      <!-- Footer content -->
    </footer>
  </body>
</html>
```

### Páginas con Tailwind

Estructura las páginas usando clases de Tailwind:

```astro
---
// src/pages/index.astro
import MainLayout from '../layouts/MainLayout.astro';
import Card from '../components/Card.astro';
---

<MainLayout title="Inicio">
  <section class="space-y-8">
    <div class="text-center py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Bienvenido a Astro + Tailwind
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Combina el poder de Astro con la flexibilidad de Tailwind CSS v4
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card title="Rendimiento" variant="primary">
        <p>Astro optimiza automáticamente tu sitio para máxima velocidad.</p>
      </Card>
      
      <Card title="Flexibilidad" variant="secondary">
        <p>Tailwind CSS te permite diseñar sin limitaciones.</p>
      </Card>
      
      <Card title="Modernidad">
        <p>Las últimas tecnologías web al alcance de tu mano.</p>
      </Card>
    </div>
  </section>
</MainLayout>
```

### Manejo de Estados y Variantes

Aprovecha las variantes de Tailwind en componentes Astro:

```astro
---
// src/components/Button.astro
interface Props {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const { 
  variant = 'primary', 
  size = 'md', 
  disabled = false 
} = Astro.props;

const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90';
---

<button 
  class={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`}
  {disabled ? 'disabled' : ''}
>
  <slot />
</button>
```

### Integración con Markdown

Usa Tailwind para estilizar contenido Markdown:

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';
import MainLayout from '../../layouts/MainLayout.astro';
import Prose from '../../components/Prose.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: post,
  }));
}

const { content, data } = Astro.props;
---

<MainLayout title={data.title}>
  <article class="max-w-4xl mx-auto">
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-4">{data.title}</h1>
      <time class="text-gray-600">{data.pubDate.toLocaleDateString()}</time>
    </header>
    
    <Prose>
      <content />
    </Prose>
  </article>
</MainLayout>
```

### Optimización de Imágenes con Tailwind

Combina el manejo de imágenes de Astro con clases de Tailwind:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../../images/hero.jpg';
---

<div class="relative w-full h-96 overflow-hidden rounded-lg">
  <Image
    src={myImage}
    alt="Descripción de la imagen"
    widths={[400, 800, 1200]}
    sizes="(max-width: 768px) 100vw, 50vw"
    class="w-full h-full object-cover"
    loading="lazy"
  />
  <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <h2 class="text-white text-3xl font-bold text-center">Título sobre imagen</h2>
  </div>
</div>
```

### Responsive Design con Astro

Aprovecha el enfoque mobile-first de Tailwind:

```astro
---
// src/components/Hero.astro
---
<section class="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8">
  <div class="max-w-7xl mx-auto">
    <div class="text-center">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Título Responsive
      </h1>
      <p class="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Texto que se adapta a diferentes tamaños de pantalla
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Botón Primario
        </button>
        <button class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
          Botón Secundario
        </button>
      </div>
    </div>
  </div>
</section>
```

### Performance Tips para Astro + Tailwind

1. **Usa CSS scoped solo cuando sea necesario**:
```astro
<style>
  /* Solo para estilos que no pueden lograrse con Tailwind */
  .custom-animation {
    animation: slideIn 0.3s ease-out;
  }
</style>
```

2. **Aprovecha el pre-rendering de Astro**:
```astro
---
// Las variables de entorno están disponibles en build time
const isProduction = import.meta.env.PROD;
---

<div class={isProduction ? 'minified-classes' : 'debug-classes'}>
  <!-- Contenido -->
</div>
```

3. **Usa layouts eficientes**:
```astro
---
// Evita anidar layouts innecesariamente
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <!-- Contenido directo sin layouts adicionales -->
</BaseLayout>
```