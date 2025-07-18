# Travel Web - Reglas de Negocio

## 🔍 Reglas de Búsqueda

### Criterios de Búsqueda
- **Mínimo de caracteres**: 2 caracteres para activar búsqueda
- **Máximo de resultados**: 50 resultados por búsqueda
- **Orden de resultados**: Relevancia → Popularidad → Alfabético
- **Tiempo de respuesta**: < 1 segundo para búsquedas

### Filtros Disponibles
- **Categoría**: Playa, Montaña, Ciudad, Cultura, Aventura
- **Región**: Europa, América, Asia, África, Oceanía
- **Temporada**: Primavera, Verano, Otoño, Invierno
- **Duración sugerida**: 1-3 días, 4-7 días, 1-2 semanas, +2 semanas

### Validaciones
- **Caracteres especiales**: Permitir acentos y caracteres internacionales
- **Búsquedas vacías**: Mostrar destinos populares
- **Sin resultados**: Sugerir destinos similares o populares

## 🏛️ Reglas de Destinos

### Información Obligatoria
- **Nombre**: Único, máximo 100 caracteres
- **País**: Clasificación por continente
- **Descripción**: Entre 100-500 palabras
- **Imagen principal**: Formato WebP, máximo 1MB
- **Coordenadas**: Latitud y longitud para mapas

### Información Complementaria
- **Clima**: Descripción por temporadas
- **Idioma principal**: Idiomas oficiales del destino
- **Moneda**: Código ISO y símbolo
- **Mejor época**: Recomendación de temporada
- **Presupuesto estimado**: Rango de precios diarios

### Actividades por Destino
- **Mínimo**: 3 actividades principales
- **Máximo**: 15 actividades por destino
- **Categorías**: Cultura, Gastronomía, Naturaleza, Aventura, Relax
- **Duración**: Tiempo estimado por actividad

### Gestión de Imágenes
- **Formato**: WebP preferido, JPG aceptado
- **Tamaño**: Máximo 1MB por imagen
- **Cantidad**: Máximo 5 imágenes por destino
- **Resolución**: Mínimo 1200x800px
- **Alt text**: Obligatorio y descriptivo

## 📋 Reglas de Itinerarios

### Estructura de Itinerarios
- **Duración mínima**: 1 día
- **Duración máxima**: 30 días
- **Actividades por día**: Máximo 8 actividades
- **Tiempo entre actividades**: Mínimo 30 minutos
- **Horario de actividades**: 6:00 AM - 11:00 PM

### Distribución de Actividades
- **Mañana (6:00-12:00)**: Máximo 3 actividades
- **Tarde (12:00-18:00)**: Máximo 3 actividades
- **Noche (18:00-23:00)**: Máximo 2 actividades
- **Tiempo de comida**: Reservar 1-2 horas

### Personalización
- **Ritmo de viaje**: Relajado, Moderado, Intenso
- **Intereses**: Cultura, Gastronomía, Naturaleza, Aventura
- **Presupuesto**: Económico, Medio, Alto
- **Tipo de viaje**: Solo, Pareja, Familia, Grupos

## 📝 Reglas de Contenido

### Textos y Descripciones
- **Descripciones de destinos**: 100-500 palabras
- **Títulos de página**: Máximo 60 caracteres
- **Meta descriptions**: 150-160 caracteres
- **Descripciones de actividades**: 50-150 palabras

### Calidad de Contenido
- **Tono**: Informativo, inspirador, neutral
- **Idioma**: Español claro y accesible
- **Precisión**: Información verificada y actualizada
- **Originalidad**: Contenido único, no copiado

### Moderación
- **Contenido prohibido**: Información falsa, promociones engañosas
- **Revisión**: Todo contenido debe ser revisado antes de publicar
- **Actualizaciones**: Revisión trimestral de información

## ⚡ Reglas de Performance

### Tiempos de Carga
- **Página inicial**: < 3 segundos
- **Páginas de destino**: < 2 segundos
- **Búsquedas**: < 1 segundo
- **Generación de itinerarios**: < 2 segundos

### Optimización de Recursos
- **Imágenes**: Lazy loading automático
- **JavaScript**: Mínimo necesario, carga diferida
- **CSS**: Inline para estilos críticos
- **Caché**: 24 horas para contenido estático

### Límites de Uso
- **Búsquedas por minuto**: 60 por IP
- **Generación de itinerarios**: 10 por hora por usuario
- **Tamaño de respuesta**: Máximo 1MB por request

## 🌐 Reglas de Accesibilidad

### Estándares de Cumplimiento
- **WCAG 2.1**: Nivel AA obligatorio
- **Contraste de color**: Mínimo 4.5:1
- **Navegación por teclado**: Completa y lógica
- **Lectores de pantalla**: Compatibilidad total

### Elementos Accesibles
- **Imágenes**: Alt text descriptivo obligatorio
- **Formularios**: Labels claros y descriptivos
- **Enlaces**: Texto descriptivo, no "click aquí"
- **Headings**: Estructura jerárquica correcta

## 📊 Reglas de SEO

### Estructura de URLs
- **Destinos**: `/destino/[nombre-destino]`
- **Itinerarios**: `/itinerario/[destino]`
- **Búsqueda**: `/buscar?q=[termino]`
- **Categorías**: `/categoria/[nombre-categoria]`

### Meta Tags
- **Title**: Único por página, incluir destino
- **Description**: Descriptiva y atractiva
- **Keywords**: Relevantes al contenido
- **Open Graph**: Para redes sociales

### Contenido SEO
- **Headings**: H1 único, H2-H6 jerárquicos
- **Enlaces internos**: Mínimo 3 por página
- **Texto ancla**: Descriptivo y variado
- **Structured data**: Schema.org para destinos

## 🔒 Reglas de Seguridad

### Protección de Datos
- **Cookies**: Solo esenciales, consentimiento explícito
- **Logs**: No guardar información personal
- **Caché**: No cachear datos sensibles
- **HTTPS**: Obligatorio en todas las páginas

### Validación de Entrada
- **Sanitización**: Todos los inputs del usuario
- **Validación**: Lado cliente y servidor
- **Límites**: Prevenir ataques de denegación de servicio

## 📱 Reglas de Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large screens**: > 1440px

### Adaptación de Contenido
- **Imágenes**: Responsive images con srcset
- **Texto**: Tamaños legibles en todos los dispositivos
- **Navegación**: Hamburger menu en móvil
- **Formularios**: Campos optimizados para touch

## 🚫 Restricciones y Limitaciones

### Restricciones Técnicas
- **Navegadores**: Últimas 2 versiones de Chrome, Firefox, Safari
- **JavaScript**: Mínimo necesario, fallbacks sin JS
- **Dependencias**: Máximo 10 librerías externas
- **Bundle size**: Máximo 200KB JavaScript inicial

### Restricciones de Contenido
- **Idiomas**: Solo español en la versión inicial
- **Destinos**: Máximo 100 destinos en MVP
- **Actualizaciones**: Contenido actualizado mensualmente
- **Moderación**: Revisión manual de todo contenido nuevo

## 📈 Métricas y Monitoreo

### KPIs Principales
- **Tiempo de permanencia**: > 3 minutos
- **Bounce rate**: < 40%
- **Conversión búsqueda-itinerario**: > 25%
- **Satisfacción usuario**: NPS > 70

### Métricas Técnicas
- **Lighthouse Score**: > 90
- **Core Web Vitals**: Cumplir estándares
- **Uptime**: > 99.9%
- **Error rate**: < 0.1%

### Revisión y Actualización
- **Revisión mensual**: Métricas de uso y performance
- **Actualización trimestral**: Reglas de negocio
- **Auditoría semestral**: Cumplimiento y optimización
