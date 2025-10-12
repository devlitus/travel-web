---
applyTo: '**/*.astro'
---

# Mejores Prácticas para Escribir Código Astro

Esta guía contiene las mejores prácticas y patrones recomendados para escribir código limpio, mantenible y eficiente en proyectos Astro 5.x basadas en la documentación oficial.

## Tabla de Contenidos

1. [Estructura de Componentes](#estructura-de-componentes)
2. [TypeScript](#typescript)
3. [Props y Tipado](#props-y-tipado)
4. [Layouts](#layouts)
5. [Slots y Composición](#slots-y-composición)
6. [Organización de Archivos](#organización-de-archivos)
7. [Optimización de Performance](#optimización-de-performance)
8. [Manejo de Datos](#manejo-de-datos)
9. [Imágenes y Assets](#imágenes-y-assets)
10. [Accesibilidad y SEO](#accesibilidad-y-seo)
11. [Patrones Anti-patterns](#patrones-anti-patterns)

---

## Estructura de Componentes

### ✅ Estructura Básica Correcta

Todo componente Astro debe seguir esta estructura de dos partes:

```astro
---
// Component Script (frontmatter) - JavaScript/TypeScript
// Importaciones
import Button from './Button.astro';

// Lógica del componente
const { title } = Astro.props;
const items = ['item1', 'item2'];
---

<!-- Component Template - HTML + Expresiones JS -->
<div class="component">
  <h2>{title}</h2>
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>
</div>

<style>
  /* Estilos scoped por defecto */
  .component {
    padding: 1rem;
  }
</style>
```

### ✅ Organización del Frontmatter

Organiza el código del frontmatter en este orden:

```astro
---
// 1. Importaciones de tipos
import type { CollectionEntry } from 'astro:content';

// 2. Importaciones de componentes Astro
import Layout from '../layouts/Layout.astro';
import Card from '../components/Card.astro';

// 3. Importaciones de componentes de frameworks
import ReactComponent from '../components/ReactComponent.jsx';

// 4. Importaciones de utilidades y funciones
import { formatDate } from '../utils/dates';

// 5. Definición de interfaces/tipos
interface Props {
  title: string;
  posts: CollectionEntry<'blog'>[];
}

// 6. Extracción de props
const { title, posts } = Astro.props;

// 7. Lógica del componente
const sortedPosts = posts.sort((a, b) => 
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

// 8. Llamadas a APIs/fetch (solo si es necesario)
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---
```

---

## TypeScript

### ✅ Configuración de TypeScript

Siempre extiende la configuración base de Astro:

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "verbatimModuleSyntax": true,
    "plugins": [
      {
        "name": "@astrojs/ts-plugin"
      }
    ]
  },
  "include": [".astro/types.d.ts", "src"],
  "exclude": ["dist"]
}
```

### ✅ Definir Tipos Globales

Usa `src/env.d.ts` para tipos globales y augmentaciones:

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

// Variables de entorno
interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly API_KEY: string;
}

// Tipos globales de la aplicación
declare namespace App {
  interface Locals {
    user: {
      id: string;
      name: string;
    } | null;
  }
  
  interface SessionData {
    cart: string[];
    preferences: Record<string, unknown>;
  }
}

// Propiedades personalizadas del Window
interface Window {
  myCustomFunction(): boolean;
}

// Atributos HTML personalizados
declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    "data-count"?: number;
    "data-label"?: string;
  }

  interface CSSProperties {
    "--theme-color"?: "light" | "dark";
  }
}
```

### ✅ Uso de `import type`

Siempre usa `import type` para importaciones de solo tipos:

```astro
---
// ✅ Correcto
import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

// ❌ Incorrecto
import { CollectionEntry } from 'astro:content';
---
```

### ✅ Type Checking en Build

Agrega validación de tipos en tu script de build:

```json
// package.json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview"
  }
}
```

---

## Props y Tipado

### ✅ Definir Interfaces para Props

Siempre define interfaces para las props de tus componentes:

```astro
---
// ✅ Correcto - con interface explícita
interface Props {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

const { 
  title, 
  description, 
  variant = 'primary',
  disabled = false 
} = Astro.props;
---

<button class={`btn btn-${variant}`} {disabled}>
  <h3>{title}</h3>
  {description && <p>{description}</p>}
</button>
```

### ✅ Props con Tipos Complejos

```astro
---
import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

interface Props {
  post: CollectionEntry<'blog'>;
  image?: ImageMetadata;
  tags?: string[];
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  metadata?: Record<string, unknown>;
}

const { post, image, tags = [], author, metadata } = Astro.props;
---
```

### ✅ Validación de Props

```astro
---
interface Props {
  items: string[];
  max?: number;
}

const { items, max = 10 } = Astro.props;

// Validación básica
if (!Array.isArray(items) || items.length === 0) {
  throw new Error('items debe ser un array no vacío');
}

const limitedItems = items.slice(0, max);
---

<ul>
  {limitedItems.map(item => <li>{item}</li>)}
</ul>
```

---

## Layouts

### ✅ Layout Base

Crea un layout base reutilizable con toda la estructura HTML:

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
  image?: string;
}

const { 
  title, 
  description = 'Descripción por defecto',
  image = '/default-og-image.jpg'
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    
    <!-- SEO -->
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(image, Astro.site)} />
    <meta property="og:type" content="website" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={new URL(image, Astro.site)} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### ✅ Layouts Anidados

Los layouts pueden ser anidados para mayor reutilización:

```astro
---
// src/layouts/BlogPostLayout.astro
import BaseLayout from './BaseLayout.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { title, description, pubDate, author } = post.data;
---

<BaseLayout title={title} description={description}>
  <article class="blog-post">
    <header>
      <h1>{title}</h1>
      <time datetime={pubDate.toISOString()}>
        {pubDate.toLocaleDateString('es-ES')}
      </time>
      <p class="author">Por {author}</p>
    </header>
    
    <div class="content">
      <slot />
    </div>
    
    <footer>
      <!-- Contenido del footer -->
    </footer>
  </article>
</BaseLayout>

<style>
  .blog-post {
    max-width: 65ch;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  header {
    margin-bottom: 2rem;
  }
  
  h1 {
    font-size: 2.5rem;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }
</style>
```

### ✅ Layouts con Props Dinámicos

```astro
---
// src/layouts/Layout.astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  showHeader?: boolean;
  showFooter?: boolean;
  containerClass?: string;
}

const { 
  title, 
  showHeader = true, 
  showFooter = true,
  containerClass = 'container'
} = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    {showHeader && <Header />}
    
    <main class={containerClass}>
      <slot />
    </main>
    
    {showFooter && <Footer />}
  </body>
</html>
```

---

## Slots y Composición

### ✅ Slot por Defecto

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="card">
  <h2>{title}</h2>
  <div class="card-content">
    <slot />
  </div>
</div>
```

### ✅ Named Slots

Usa named slots para mayor control sobre la composición:

```astro
---
// src/components/Layout.astro
---
<div class="page-layout">
  <header>
    <slot name="header" />
  </header>
  
  <aside>
    <slot name="sidebar" />
  </aside>
  
  <main>
    <slot />
  </main>
  
  <footer>
    <slot name="footer" />
  </footer>
</div>
```

**Uso:**

```astro
---
import Layout from '../components/Layout.astro';
---

<Layout>
  <div slot="header">
    <h1>Mi Sitio</h1>
  </div>
  
  <div slot="sidebar">
    <nav><!-- navegación --></nav>
  </div>
  
  <div>
    <!-- Contenido principal (slot por defecto) -->
    <p>Contenido de la página</p>
  </div>
  
  <div slot="footer">
    <p>&copy; 2025 Mi Sitio</p>
  </div>
</Layout>
```

### ✅ Slots con Fallback Content

```astro
---
// src/components/Alert.astro
interface Props {
  type?: 'info' | 'warning' | 'error' | 'success';
}

const { type = 'info' } = Astro.props;
---

<div class={`alert alert-${type}`}>
  <div class="alert-icon">
    <slot name="icon">
      <!-- Fallback icon por defecto -->
      <svg><!-- icono por defecto --></svg>
    </slot>
  </div>
  
  <div class="alert-content">
    <slot>
      <!-- Mensaje por defecto si no se proporciona contenido -->
      <p>Mensaje de alerta</p>
    </slot>
  </div>
</div>
```

### ✅ Componentes Recursivos con Astro.self

Para componentes que necesitan renderizarse recursivamente:

```astro
---
// src/components/NestedList.astro
interface Props {
  items: (string | string[])[];
}

const { items } = Astro.props;
---

<ul class="nested-list">
  {items.map((item) => (
    <li>
      {Array.isArray(item) ? (
        <Astro.self items={item} />
      ) : (
        item
      )}
    </li>
  ))}
</ul>

<style>
  .nested-list {
    margin-left: 1.5rem;
  }
</style>
```

---

## Organización de Archivos

### ✅ Estructura de Proyecto Recomendada

```
src/
├── assets/           # Assets importados (imágenes, fuentes, etc.)
│   ├── images/
│   └── fonts/
├── components/       # Componentes reutilizables
│   ├── ui/          # Componentes UI básicos
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   └── Input.astro
│   ├── layout/      # Componentes de layout
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Navigation.astro
│   └── features/    # Componentes específicos de features
│       └── SearchForm.astro
├── content/         # Content Collections
│   ├── blog/
│   └── config.ts
├── layouts/         # Layouts de página
│   ├── BaseLayout.astro
│   └── BlogLayout.astro
├── pages/           # Rutas de la aplicación
│   ├── index.astro
│   ├── about.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── api/         # API endpoints
│       └── posts.json.ts
├── styles/          # Estilos globales
│   └── global.css
└── utils/           # Funciones utilitarias
    ├── formatters.ts
    └── validators.ts
```

### ✅ Nomenclatura de Archivos

- **Componentes Astro**: PascalCase (`Card.astro`, `BlogPost.astro`)
- **Páginas**: kebab-case (`index.astro`, `about-us.astro`)
- **Utilidades**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Estilos**: kebab-case (`global.css`, `blog-post.css`)
- **Imágenes**: kebab-case (`hero-image.jpg`, `logo-dark.svg`)

### ✅ Imports Relativos vs Alias

```astro
---
// ❌ Imports relativos largos
import Button from '../../../components/ui/Button.astro';

// ✅ Usa alias de path (configurado en tsconfig.json)
import Button from '@/components/ui/Button.astro';
import { formatDate } from '@/utils/formatters';
---
```

**Configuración en tsconfig.json:**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"]
    }
  }
}
```

---

## Optimización de Performance

### ✅ Minimizar JavaScript del Cliente

Astro pre-renderiza todo por defecto. Solo agrega JS del cliente cuando sea necesario:

```astro
---
import InteractiveComponent from './InteractiveComponent.jsx';
---

<!-- ❌ Carga JS innecesariamente -->
<InteractiveComponent client:load />

<!-- ✅ Solo carga si el componente necesita interactividad -->
<InteractiveComponent client:visible />

<!-- ✅ Mejor aún, usa solo HTML/CSS si es posible -->
<details>
  <summary>Click para expandir</summary>
  <p>Contenido sin JavaScript</p>
</details>
```

### ✅ Client Directives Correctas

Usa la directiva apropiada según el caso:

```astro
---
import Counter from './Counter.jsx';
import Chat from './Chat.jsx';
import Analytics from './Analytics.jsx';
import HeavyComponent from './HeavyComponent.jsx';
---

<!-- Para componentes críticos que deben cargar inmediatamente -->
<Counter client:load />

<!-- Para componentes que pueden esperar a que el navegador esté idle -->
<Analytics client:idle />

<!-- Para componentes que solo necesitan JS cuando son visibles -->
<HeavyComponent client:visible />

<!-- Para componentes que dependen del tamaño de pantalla -->
<MobileMenu client:media="(max-width: 768px)" />

<!-- Solo HTML, sin hidratación -->
<StaticComponent client:only="solid" />
```

### ✅ Streaming de Componentes

Separa llamadas a APIs en componentes individuales para aprovechar streaming:

```astro
---
// ❌ Todo se bloquea esperando ambas llamadas
const [userData, postsData] = await Promise.all([
  fetch('/api/user'),
  fetch('/api/posts')
]);
---

<!-- La página no renderiza hasta que todo esté listo -->
<User data={userData} />
<Posts data={postsData} />
```

```astro
---
// ✅ Cada componente maneja su propia carga
import UserProfile from '../components/UserProfile.astro';
import PostsList from '../components/PostsList.astro';
---

<!-- El HTML estático se muestra primero -->
<h1>Mi Página</h1>

<!-- Cada componente hace streaming cuando sus datos están listos -->
<UserProfile />
<PostsList />
```

### ✅ Optimización de Imágenes

Siempre usa el componente `Image` de Astro:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- ✅ Correcto - optimización automática -->
<Image
  src={heroImage}
  alt="Descripción significativa"
  width={800}
  height={600}
  loading="lazy"
  decoding="async"
/>

<!-- ❌ Evitar - sin optimización -->
<img src="/images/hero.jpg" alt="Hero" />
```

### ✅ Autorizar Dominios de Imágenes Remotas

```typescript
// astro.config.mjs
export default defineConfig({
  image: {
    // Opción 1: Dominios específicos
    domains: ["images.unsplash.com", "cdn.example.com"],
    
    // Opción 2: Patrones de URL
    remotePatterns: [
      { protocol: "https" },
      { protocol: "https", hostname: "**.example.com" }
    ]
  }
});
```

### ✅ Prefetch de Enlaces

```astro
---
// Habilita prefetch para navegación rápida
---
<a href="/about" data-astro-prefetch>Sobre Nosotros</a>
<a href="/blog" data-astro-prefetch="hover">Blog</a>
```

---

## Manejo de Datos

### ✅ Fetch en el Servidor

Todo fetch se ejecuta en build time o server-side, nunca en el cliente:

```astro
---
// ✅ Esto se ejecuta en el servidor
const response = await fetch('https://api.example.com/posts');
const posts = await response.json();

// ✅ Variables de entorno disponibles
const apiKey = import.meta.env.API_KEY;
---

<ul>
  {posts.map(post => (
    <li>{post.title}</li>
  ))}
</ul>
```

### ✅ Content Collections

Usa Content Collections para contenido estructurado:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

**Uso en páginas:**

```astro
---
import { getCollection } from 'astro:content';

// Filtrar y ordenar
const posts = await getCollection('blog', ({ data }) => {
  return !data.draft && data.pubDate <= new Date();
});

const sortedPosts = posts.sort((a, b) => 
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<ul>
  {sortedPosts.map(post => (
    <li>
      <a href={`/blog/${post.slug}`}>
        {post.data.title}
      </a>
    </li>
  ))}
</ul>
```

### ✅ API Routes

Crea endpoints API con tipado fuerte:

```typescript
// src/pages/api/posts.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ request }) => {
  try {
    const posts = await getCollection('blog');
    
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error al obtener posts' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### ✅ Manejo de Formularios con Actions

```typescript
// src/actions/newsletter.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  subscribe: defineAction({
    input: z.object({
      email: z.string().email(),
      name: z.string().min(2),
    }),
    handler: async (input) => {
      // Lógica de suscripción
      await subscribeToNewsletter(input);
      
      return { success: true };
    },
  }),
};
```

---

## Imágenes y Assets

### ✅ Importar Imágenes Locales

```astro
---
import { Image } from 'astro:assets';
import logo from '../assets/logo.png';
import hero from '../assets/hero.jpg';
---

<!-- ✅ Optimización automática con tipos seguros -->
<Image
  src={logo}
  alt="Logo de la empresa"
  width={200}
  height={100}
/>

<Image
  src={hero}
  alt="Imagen hero"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

### ✅ Imágenes Responsive

```astro
---
import { Image, Picture } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- Picture para múltiples formatos -->
<Picture
  src={heroImage}
  formats={['avif', 'webp', 'jpg']}
  alt="Hero image"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### ✅ Imágenes con Tipado

```astro
---
import type { ImageMetadata } from 'astro';
import type { SvgComponent } from 'astro/types';
import HomeIcon from './icons/Home.svg';

interface Props {
  image: ImageMetadata;
  icon?: SvgComponent;
}

const { image, icon: Icon } = Astro.props;
---

<Image src={image} alt="..." />
{Icon && <Icon />}
```

---

## Accesibilidad y SEO

### ✅ Estructura Semántica

```astro
---
const { title } = Astro.props;
---

<article>
  <header>
    <h1>{title}</h1>
    <time datetime="2025-01-01">1 de enero, 2025</time>
  </header>
  
  <main>
    <slot />
  </main>
  
  <footer>
    <nav aria-label="Enlaces relacionados">
      <!-- navegación -->
    </nav>
  </footer>
</article>
```

### ✅ ARIA y Accesibilidad

```astro
---
const { isOpen } = Astro.props;
---

<button 
  aria-expanded={isOpen}
  aria-controls="menu"
  aria-label="Abrir menú de navegación"
>
  <span aria-hidden="true">☰</span>
</button>

<nav 
  id="menu"
  aria-label="Navegación principal"
  hidden={!isOpen}
>
  <!-- contenido del menú -->
</nav>
```

### ✅ Meta Tags y SEO

```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
}

const { 
  title, 
  description, 
  image = '/default-og.jpg',
  type = 'website'
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogImageURL = new URL(image, Astro.site);
---

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- SEO Básico -->
  <title>{title} | Mi Sitio</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />
  
  <!-- Open Graph -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImageURL} />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageURL} />
</head>
```

---

## Patrones Anti-patterns

### ❌ NO Hacer

```astro
---
// ❌ No usar import sin type para tipos
import { CollectionEntry } from 'astro:content';

// ❌ No usar any
const data: any = await fetch('/api');

// ❌ No ignorar props opcionales
interface Props {
  title: string;
  description: string; // debería ser opcional
}

// ❌ No fetch en el cliente sin necesidad
const response = await fetch('/api/data');
---

<!-- ❌ No usar img directamente para assets locales -->
<img src="/images/hero.jpg" />

<!-- ❌ No hidratar componentes sin necesidad -->
<StaticComponent client:load />

<!-- ❌ No olvidar alt en imágenes -->
<Image src={image} />

<!-- ❌ No usar divs para todo -->
<div>
  <div class="header">...</div>
  <div class="content">...</div>
</div>
```

### ✅ SÍ Hacer

```astro
---
// ✅ Usa import type
import type { CollectionEntry } from 'astro:content';

// ✅ Tipos específicos
interface ApiResponse {
  data: string[];
  total: number;
}
const data: ApiResponse = await fetch('/api').then(r => r.json());

// ✅ Props opcionales apropiadas
interface Props {
  title: string;
  description?: string;
}

// ✅ Fetch en el servidor
const posts = await getCollection('blog');
---

<!-- ✅ Usa Image de Astro -->
<Image src={heroImage} alt="Descripción significativa" />

<!-- ✅ Solo hidrata cuando sea necesario -->
<StaticComponent />

<!-- ✅ Siempre incluye alt -->
<Image src={image} alt="Descripción de la imagen" />

<!-- ✅ Usa elementos semánticos -->
<article>
  <header>...</header>
  <main>...</main>
</article>
```

---

## Resumen de Reglas Clave

### Estructura
- ✅ Dos partes: frontmatter + template + styles
- ✅ Organiza el frontmatter lógicamente
- ✅ Usa PascalCase para componentes, kebab-case para páginas

### TypeScript
- ✅ Extiende `astro/tsconfigs/strict`
- ✅ Usa `import type` para tipos
- ✅ Define interfaces para todas las Props
- ✅ Usa `env.d.ts` para tipos globales

### Performance
- ✅ Minimiza JavaScript del cliente
- ✅ Usa client directives apropiadas
- ✅ Aprovecha streaming separando fetch en componentes
- ✅ Optimiza imágenes con el componente `Image`

### Composición
- ✅ Usa layouts para estructura común
- ✅ Aprovecha slots (default y named)
- ✅ Anida componentes apropiadamente
- ✅ Usa `Astro.self` para recursión

### Datos
- ✅ Todo fetch en el servidor
- ✅ Usa Content Collections para contenido
- ✅ Crea API routes tipadas
- ✅ Valida datos con Zod

### Accesibilidad
- ✅ Usa HTML semántico
- ✅ Incluye atributos ARIA apropiados
- ✅ Siempre incluye alt en imágenes
- ✅ Asegura contraste y navegación por teclado

---

## Referencias

- [Documentación Oficial de Astro](https://docs.astro.build/)
- [Astro Components](https://docs.astro.build/en/basics/astro-components/)
- [TypeScript en Astro](https://docs.astro.build/en/guides/typescript/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Imágenes en Astro](https://docs.astro.build/en/guides/images/)
