# 🌍 Travel Web - Generador de Itinerarios con IA

<div align="center">
Una aplicación web moderna construida con **Astro 5.14+** que permite a los usuarios buscar destinos de viaje y generar itinerarios personalizados basados en sus preferencias.

Una aplicación web moderna construida con **Astro 5.x** y **Gemini AI** que genera itinerarios de viaje completos y personalizados en segundos.

[![Astro](https://img.shields.io/badge/Astro-5.14.4-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/devlitus/travel-web?style=for-the-badge)](https://github.com/devlitus/travel-web/stargazers)

### 📸 Preview

![Travel Web Screenshot](./.github/assets/screenshot.png)
_Generador de itinerarios con IA - Formulario de preferencias_
- **Framework**: [Astro 5.14+](https://astro.build/)
- **Lenguaje**: TypeScript 5.9+
- **Estilos**: [Tailwind CSS 4.1+](https://tailwindcss.com/)
- **IA**: Groq AI (antes Google Generative AI)
- **Testing**: [Vitest](https://vitest.dev/)
- **Deployment**: [Vercel](https://vercel.com/)
- **APIs**: Unsplash para imágenes

</div>

---

## 📑 Tabla de Contenido

- [✨ Características](#-características-principales)
- [📚 Documentación](#-documentación)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [🎯 Cómo Funciona](#-cómo-funciona)
- [🏗️ Estructura del Proyecto](#️-estructura-del-proyecto)
- [🚢 Deployment](#-deployment-en-vercel)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contribuciones](#-contribuciones)
- [📞 Soporte](#-soporte-y-contacto)

---

## ✨ Características Principales

- 🤖 **Generación con IA** - Itinerarios únicos creados por Gemini AI 2.0 Flash
- ⚡ **Ultra rápido** - Resultados en menos de 5 segundos
- 🎯 **Personalización total** - 7 parámetros + actividades seleccionables
- � **Responsive** - Perfectamente adaptado a todos los dispositivos
- 💾 **Sistema de caché** - Respuestas optimizadas y reutilizadas
- 🖼️ **Imágenes de calidad** - Integración con Unsplash API
- 🚫 **Sin registro** - Experiencia sin fricción

## 📚 Documentación

### Para Desarrolladores

- 📋 **[Business Rules](./.github/business-rules.md)** - Especificaciones técnicas completas
  - Validaciones y schemas (Zod)
  - Sistema de cache detallado
  - Configuración de APIs
  - Reglas de performance
  - Checklist de implementación

- 💻 **[Copilot Instructions](./.github/copilot-instructions.md)** - Guía de desarrollo
  - Convenciones de código
  - Estructura de componentes Astro
  - Mejores prácticas
  - Patrones del proyecto

- � **[Cache System](./CACHE_SYSTEM.md)** - Sistema de cache en detalle
  - Implementación de MemoryCache
  - Estrategias de invalidación
  - Uso y ejemplos

### Para Producto y Negocio

- 📋 **[Project Briefing](./.github/project-briefing.md)** - Visión y estrategia
  - Objetivo y propuesta de valor
  - Público objetivo
  - Roadmap de producto (v1.0 → v3.5)
  - Diferenciadores competitivos
  - Definición de éxito

### Instrucciones Específicas

- 🎨 **[Astro Best Practices](./.github/instructions/astro-best-practices.instructions.md)**
- 🎨 **[Tailwind Best Practices](./.github/instructions/tailwind-best-practices.instructions.md)**

## 🛠️ Stack Tecnológico

| Categoría      | Tecnología                               | Versión              |
| -------------- | ---------------------------------------- | -------------------- |
| **Framework**  | [Astro](https://astro.build/)            | 5.14.4               |
| **Lenguaje**   | TypeScript                               | 5.9.2                |
| **Estilos**    | [Tailwind CSS](https://tailwindcss.com/) | 4.1.11               |
| **IA**         | Google Gemini AI                         | 2.0 Flash            |
| **Validación** | Zod                                      | (via @astrojs/check) |
| **Deployment** | [Vercel](https://vercel.com/)            | SSG + API Routes     |
| **Imágenes**   | Unsplash API                             | -                    |

## 🏗️ Estructura del Proyecto

```text
travel-web/
├── .github/
│   ├── instructions/           # Instrucciones específicas por tipo
│   ├── business-rules.md       # Especificaciones técnicas
│   ├── project-briefing.md     # Visión y estrategia
│   └── copilot-instructions.md # Guía de desarrollo
├── public/
│   └── robots.txt
├── src/
│   ├── __tests__/        # Tests unitarios e integración
│   │   └── api/          # Tests de endpoints API
│   ├── assets/           # Recursos estáticos
│   │   └── images/       # Imágenes de destinos
│   ├── components/       # Componentes reutilizables
│   │   ├── Header/       # Componente de encabezado
│   │   ├── SEO/          # Componente de SEO
│   │   ├── Toast/        # Sistema de notificaciones
│   │   └── TravelForm/   # Formulario principal de búsqueda
│   ├── layouts/          # Layouts base
│   │   └── Layout.astro  # Layout principal
│   ├── pages/            # Páginas y API routes
│   │   ├── api/          # Endpoints de la API
│   │   │   ├── search.ts         # Búsqueda de destinos
│   │   │   └── unsplash-image.ts # Obtención de imágenes
│   │   ├── index.astro   # Página de inicio
│   │   └── itinerary/    # Páginas dinámicas de itinerarios
│   ├── styles/           # Estilos globales
│   │   ├── global.css
│   │   └── itinerary.css
│   └── utils/         | Acción                                               |
| :------------------- | :--------------------------------------------------- |
| `npm install`        | Instala las dependencias                             |
| `npm run dev`        | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build`      | Construye el sitio para producción en `./dist/`      |
| `npm run preview`    | Previsualiza la build localmente                     |
| `npm run test`       | Ejecuta los tests en modo watch                      |
| `npm run test:ui`    | Ejecuta tests con interfaz visual                    |
| `npm run test:coverage` | Genera reporte de cobertura de tests            |
| `npm run astro`   ation/   # Documentación de migración a Groq
├── astro.config.mjs      # Configuración de Astro
├── tailwind.config.mjs   # Configuración de Tailwind
├── tsconfig.json         # Configuración de TypeScript
├── vitest.config.ts      # Configuración de tests
└── vercel.json           # Configuración de deployment
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+
- npm o pnpm
- API Keys (ver configuración)

### Instalación

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/devlitus/travel-web.git
   cd travel-web
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ROQ_API_KEY=tu_api_key_de_groq

   Crea un archivo `.env` en la raíz del proyecto:

   ```env
   # Requerido
   GEMINI_API_KEY=tu_api_key_de_gemini

   # Opcional (para imágenes)
   UNSPLASH_ACCESS_KEY=tu_access_key_de_unsplash
   ```

   > 📝 **Cómo obtener las API Keys:**
   >
   > - **Gemini AI**: [https://ai.google.dev/](https://ai.google.dev/)
   > - **Unsplash**: [https://unsplash.com/developers](https://unsplash.com/developers)

4. **Inicia el servidor de desarrollo**

   ```bash
   npm run dev
   ```

5. **Abre tu navegador** en `http://localhost:4321`

### Comandos Disponibles

| Comando           | Acción                                               |
| :---------------- | :--------------------------------------------------- |
| `npm install`     | Instala las dependencias                             |
| `npm run dev`     | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build`   | Construye el sitio para producción en `./dist/`      |
| `npm run preview` | Previsualiza la build localmente                     |
| `npm run astro`   | Ejecuta comandos CLI de Astro                        |

## 🎯 Cómo Funciona

### Flujo de Usuario

- Itinerarios personalizados basados en Groq AI
- Recomendaciones de actividades y lugares
- Integración con imágenes de alta calidad desde Unsplash

### Sistema de Caché Multicapa

- Cache del servidor (Memory) para APIs
- Cache del cliente (LocalStorage) para formularios y búsquedas
- Cache de assets con HTTP headers optimizados
- Gestión automática de datos temporales
- Optimización de llamadas a APIs externas
- Ver [CACHE_SYSTEM.md](CACHE_SYSTEM.md) para detalles

### Testing Automatizado

- Tests unitarios e integración con Vitest
- Cobertura de tests para APIs y servicios
- Interfaz visual para ejecución de tests
- Ver [TESTING.md](TESTING.md) para más información

4. Usuario visualiza itinerario personalizado
   └── Con imagen del destino (Unsplash)
```

### Características Técnicas Clave

- 🗼 **París** - La ciudad del amor
- 🏛️ **Roma** - Historia y cultura
- 🗽 **Nueva York** - La gran man4.1+ con configuración personalizada. Puedes modificar los estilos en:

- `src/styles/global.css` - Estilos globales
- `src/components/*/**.css` - Estilos scoped de componentes
- `src/styles/itinerary.css` - Estilos específicos de itinerarios

### APIs y Servicios

- **Groq AI**: Generación de itinerarios con el modelo llama-3.1-70b
- **Unsplash**: Obtención de imágenes de destinos
- **Sistema de Caché**: Multicapa optimizado para performance

### Estructura de Componentes

- Componentes server-side por defecto (mejora performance)
- Cliente hidratación selectiva con directivas `client:*`
- TypeScript obligatorio para type safety:
  - `GROQ_API_KEY` - API key de Groq
  - `UNSPLASH_ACCESS_KEY` - Access key de Unsplash

3. El deployment se ejecuta automáticamente en cada push a main
4. Los assets estáticos se cachean por 1 año
5. Las imágenes dinámicas se cachean por 1 día
   El proyecto utiliza Tailwind CSS con configuración personalizada. Puedes modificar los estilos en:

### Variables de Entorno en Vercel

Ve a: `Project Settings → Environment Variables`

- \*\*� Documentación Adicional

- [CACHE_SYSTEM.md](CACHE_SYSTEM.md) - Detalles del sistema de caché
- [TESTING.md](TESTING.md) - Guía de testing y ejecución de tests
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - Convenciones de codificación del proyecto

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ve el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Asegúrate que los tests pasen (`npm run test`)
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
   6# 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ve el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o problemas, puedes:

- Crear un [issue](https://github.com/devlitus/travel-web/issues)
- Contactar al equipo de desarrollo

---

## 🗺️ Roadmap

### ✅ v1.0 - MVP (Actual)

- Formulario de preferencias
- Generación con IA
- Sistema de cache
- Responsive design

### � v2.0 - Persistencia (Próximo)

- URLs únicas para compartir itinerarios
- Sistema de favoritos
- Guardar itinerarios

### 🚀 v2.5 - Mejoras UX

- Editar itinerarios generados
- Exportar a PDF
- Mapa interactivo
- Integración con calendario

### 💰 v3.0 - Monetización

- Links de afiliación (hoteles, vuelos)
- Booking de actividades
- Versión Premium

> 📋 Para roadmap completo y detallado, ver [project-briefing.md](./.github/project-briefing.md)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas!

### Cómo Contribuir

1. **Fork** el proyecto
2. Crea una **rama** para tu feature:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m 'Add: AmazingFeature'
   ```
4. **Push** a la rama:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Abre un **Pull Request**

### Guías de Contribución

Antes de contribuir, por favor revisa:

- 📋 [Business Rules](./.github/business-rules.md) - Reglas técnicas
- 💻 [Copilot Instructions](./.github/copilot-instructions.md) - Convenciones de código
- 🎨 [Astro Best Practices](./.github/instructions/astro-best-practices.instructions.md)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📞 Soporte y Contacto

### Reportar Issues

¿Encontraste un bug o tienes una sugerencia?

- 🐛 [Crear un Issue](https://github.com/devlitus/travel-web/issues)
- 💬 [Discussions](https://github.com/devlitus/travel-web/discussions)

### Recursos Adicionales

- 📖 [Documentación de Astro](https://docs.astro.build)
- 🎨 [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- 🤖 [Google Gemini AI](https://ai.google.dev/)

---

## 👨‍💻 Autor

**@devlitus**

- GitHub: [@devlitus](https://github.com/devlitus)
- Repository: [travel-web](https://github.com/devlitus/travel-web)

---

<div align="center">

⭐ **¡Si este proyecto te resultó útil, considera darle una estrella!** ⭐

**Construido con ❤️ usando Astro y Gemini AI**

</div>
