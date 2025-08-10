# 🌍 Travel Web - Generador de Itinerarios de Viaje

Una aplicación web moderna construida con **Astro 5.x** que permite a los usuarios buscar destinos de viaje y generar itinerarios personalizados basados en sus preferencias.

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

- **Framework**: [Astro 5.x](https://astro.build/)
- **Lenguaje**: TypeScript
- **Estilos**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **IA**: Google Generative AI
- **Deployment**: [Vercel](https://vercel.com/)
- **APIs**: Unsplash para imágenes

## 🚀 Estructura del Proyecto

```text
travel-web/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/           # Recursos estáticos
│   │   └── images/       # Imágenes de destinos
│   ├── components/       # Componentes reutilizables
│   │   ├── Header/
│   │   └── TravelForm/
│   ├── layouts/          # Layouts base
│   ├── pages/            # Páginas y API routes
│   │   ├── api/          # Endpoints de la API
│   │   └── itinerary/    # Páginas dinámicas de itinerarios
│   ├── styles/           # Estilos globales
│   └── utils/            # Utilidades y servicios
├── astro.config.mjs      # Configuración de Astro
├── tailwind.config.js    # Configuración de Tailwind
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

- Itinerarios personalizados basados en IA
- Recomendaciones de actividades y lugares
- Integración con imágenes de alta calidad

### Sistema de Caché

- Caché inteligente para mejorar el rendimiento
- Gestión automática de datos temporales
- Optimización de llamadas a APIs externas

## 📁 Destinos Disponibles

El proyecto incluye información detallada para destinos como:

- 🗼 **París** - La ciudad del amor
- 🏛️ **Roma** - Historia y cultura
- 🗽 **Nueva York** - La gran manzana
- 🗾 **Tokio** - Tradición y modernidad
- 🎭 **Sidney** - Belleza natural
- 🏔️ **Montana** - Aventura en la naturaleza
- 🏝️ **Destinos tropicales** - Playas paradisíacas

## 🔧 Configuración Avanzada

### Personalización de Estilos

El proyecto utiliza Tailwind CSS con configuración personalizada. Puedes modificar los estilos en:

- `src/styles/global.css` - Estilos globales
- `src/components/*/**.css` - Estilos de componentes

### APIs y Servicios

- **Google AI**: Generación de contenido de itinerarios
- **Unsplash**: Obtención de imágenes de destinos
- **Cache System**: Sistema de caché personalizado

## 🚢 Deployment

El proyecto está configurado para deployment automático en Vercel:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. El deployment se ejecuta automáticamente en cada push

## 📄 Licencia

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
