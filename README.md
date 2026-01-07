# 🌍 Travel Web - Generador de Itinerarios de Viaje

Una aplicación web moderna construida con **Astro 5.14+** que permite a los usuarios buscar destinos de viaje y generar itinerarios personalizados basados en sus preferencias.

![Travel Web Preview](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop)

## ✨ Características

- 🔍 **Búsqueda inteligente** de destinos turísticos
- 📋 **Generación automática** de itinerarios personalizados
- 🎨 **Interfaz moderna** con Tailwind CSS
- ⚡ **Rendimiento optimizado** con Astro SSG
- 📱 **Diseño responsive** para todos los dispositivos
- 🌐 **Integración con APIs** externas (Unsplash)
- 💾 **Sistema de caché** optimizado

## 🛠️ Tecnologías

- **Framework**: [Astro 5.14+](https://astro.build/)
- **Lenguaje**: TypeScript 5.9+
- **Estilos**: [Tailwind CSS 4.1+](https://tailwindcss.com/)
- **IA**: Groq AI (antes Google Generative AI)
- **Testing**: [Vitest](https://vitest.dev/)
- **Deployment**: [Vercel](https://vercel.com/)
- **APIs**: Unsplash para imágenes

## 🚀 Estructura del Proyecto

```text
travel-web/
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

## 🧞 Comandos Disponibles

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando           | Acción                                               |
| :---------------- | :--------------------------------------------------- |
| `npm install`     | Instala las dependencias                             |
| `npm run dev`     | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build`   | Construye el sitio para producción en `./dist/`      |
| `npm run preview` | Previsualiza la build localmente                     |
| `npm run astro`   | Ejecuta comandos CLI de Astro                        |

## 🚀 Inicio Rápido

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

   ```bash
   # Crea un archivo .env.local con:
   GOOGLE_AI_API_KEY=tu_api_key_de_google_ai
   UNSPLASH_ACCESS_KEY=tu_access_key_de_unsplash
   ```

4. **Inicia el servidor de desarrollo**

   ```bash
   npm run dev
   ```

5. **Abre tu navegador** en `http://localhost:4321`

## 🎯 Funcionalidades Principales

### Búsqueda de Destinos

- Formulario intuitivo para capturar preferencias de viaje
- Filtros por tipo de actividad, presupuesto y duración
- Sugerencias automáticas de destinos populares

### Generación de Itinerarios

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

## 📁 Destinos Disponibles

El proyecto incluye información detallada para destinos como:

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

- `src/styles/global.css` - Estilos globales
- `src/components/*/**.css` - Estilos de componentes

### APIs y Servicios

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

⭐ ¡No olvides dar una estrella al proyecto si te ha sido útil!
