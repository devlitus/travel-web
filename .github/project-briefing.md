# Travel Web - Project Briefing

> **Documento de Visión y Estrategia**  
> Última actualización: 12 de octubre de 2025

## 🎯 Visión del Producto

**"La forma más rápida de crear itinerarios de viaje personalizados usando inteligencia artificial"**

Aplicación web que utiliza **IA generativa (Gemini AI)** para crear itinerarios de viaje completos y personalizados en segundos, adaptados a las preferencias únicas de cada usuario.

### Problema que Resuelve

- ⏰ Planificar un viaje toma **horas de investigación** y comparación
- 📚 Demasiada información dispersa en múltiples fuentes
- 🤔 Difícil saber qué actividades se ajustan a presupuesto y estilo
- 😓 Crear itinerarios coherentes requiere experiencia

### Solución

Un **formulario simple** que captura preferencias del usuario y genera un **itinerario completo día por día** usando IA, con actividades, horarios, ubicaciones y costos estimados.

---

## 👥 Público Objetivo

### Primario

- **Millennials y Gen Z** (25-40 años): Nativos digitales, valoran eficiencia y personalización
- **Profesionales ocupados**: Poco tiempo para planificar, buscan soluciones rápidas
- **Viajeros primerizos**: Necesitan guía estructurada y confiable

### Secundario

- **Familias**: Buscan itinerarios seguros y organizados
- **Parejas**: Planificando lunas de miel o escapadas románticas
- **Grupos de amigos**: Viajes de aventura o culturales

### Características del Usuario Ideal

- Cómodo con tecnología
- Valora la eficiencia sobre el control total
- Confía en recomendaciones de IA
- Busca inspiración + planificación en un solo lugar

---

## 💡 Propuesta de Valor Única

### Diferenciadores Clave

1. **⚡ Velocidad**: Itinerario completo en **menos de 5 segundos**
2. **🤖 IA Generativa**: No es contenido estático, cada itinerario es único
3. **🎯 Personalización**: 7 parámetros + actividades = miles de combinaciones
4. **🚫 Sin fricción**: No requiere registro, no hay pasos innecesarios
5. **🆓 Gratis**: Sin costo para el usuario (MVP)

### Ventajas vs Competencia

| Feature                     | Travel Web    | Competidores          |
| --------------------------- | ------------- | --------------------- |
| **Velocidad de generación** | < 5 segundos  | Manual (horas)        |
| **Personalización**         | IA adaptativa | Templates fijos       |
| **Registro requerido**      | No            | Sí                    |
| **Costo**                   | Gratis        | Freemium/Pago         |
| **Actualización contenido** | Dinámica (IA) | Manual/Desactualizada |

---

## 🎨 Identidad Visual y UX

### Principios de Diseño

1. **Minimalismo**: Interfaz limpia, sin distracciones
2. **Claridad**: Cada elemento tiene un propósito obvio
3. **Velocidad percibida**: Feedback inmediato, loading states claros
4. **Inspiración**: Imágenes de calidad, emoji emotivos
5. **Confianza**: Información detallada y precisa

### Paleta de Colores (Concepto)

- **Dark theme**: Fondo oscuro para reducir fatiga visual
- **Acentos brillantes**: Azules/verdes para CTAs y elementos interactivos
- **Glassmorphism**: Efectos de vidrio esmerilado para cards
- **Gradientes sutiles**: Profundidad y modernidad

### Tono de Comunicación

- **Inspirador**: "¿Dónde sueñas viajar? 🌍"
- **Cercano**: Tuteo, emoji, lenguaje natural
- **Informativo**: Datos precisos cuando se necesitan
- **Optimista**: Enfoque positivo en posibilidades

---

## 📱 Experiencia de Usuario

### Flujo Principal (Actual)

```
1. Landing Page
   ↓
2. Formulario de Preferencias (único paso)
   - Destino (texto libre)
   - Presupuesto (low/medium/high)
   - Duración (weekend a 1 mes)
   - Estilo de viaje
   - Alojamiento
   - Temporada
   - Actividades (múltiple selección)
   ↓
3. Generación con IA (2-5 segundos)
   ↓
4. Itinerario Completo
   - Vista día por día
   - Actividades con horarios
   - Costos estimados
   - Imagen del destino (Unsplash)
```

### Experiencia Ideal

- ✅ **0 clics antes del formulario** (landing = formulario)
- ✅ **1 clic para generar** (submit button)
- ✅ **Respuesta inmediata** (< 5 segundos con IA)
- ⏳ **Compartir URL** (futuro)
- ⏳ **Ajustar itinerario** (futuro)
- ⏳ **Exportar PDF** (futuro)

---

## 🎯 Definición de Éxito (Cualitativa)

El proyecto es exitoso cuando:

### Para el Usuario

- ✅ Puede crear un itinerario completo en **menos de 1 minuto**
- ✅ El itinerario generado es **útil y aplicable** en la vida real
- ✅ La experiencia es **intuitiva** sin necesitar instrucciones
- ✅ Se siente **inspirado** a viajar después de usar la app

### Para el Producto

- ✅ Los usuarios completan el formulario (baja tasa de abandono)
- ✅ Los itinerarios generados tienen sentido lógico
- ✅ La app es **rápida** en todos los dispositivos
- ✅ No hay errores críticos en producción

### Para el Negocio (Futuro)

- 💰 Monetización vía afiliación con bookings
- 📊 1000+ itinerarios generados mensualmente
- ⭐ NPS > 70 (Net Promoter Score)
- 🔄 30%+ de usuarios regresan

---

## �️ Roadmap de Producto

### ✅ **v1.0 - MVP** (Actual)

**Estado**: Implementado y en producción

**Features**:

- Formulario de preferencias (7 parámetros)
- Generación de itinerarios con Gemini AI
- Vista de itinerario día por día
- Imágenes de destinos (Unsplash)
- Responsive design

---

### 🔄 **v2.0 - Persistencia y Social**

**Estado**: Planeado

**Features**:

- 🔗 **URLs únicas por itinerario** (compartir)
- 💾 **Guardar itinerarios** (localStorage o DB)
- ❤️ **Sistema de favoritos**
- 📤 **Compartir en redes sociales**
- 🖼️ **Galería de imágenes** del destino

**Valor**: Permite a usuarios guardar y compartir sus itinerarios

---

### 🚀 **v2.5 - Mejoras de UX**

**Estado**: Conceptual

**Features**:

- ✏️ **Editar itinerario** generado
- 📄 **Exportar a PDF**
- 🗺️ **Mapa interactivo** con ubicaciones
- 📅 **Integración con Google Calendar**
- 🌤️ **Información de clima**

**Valor**: Mayor control y utilidad práctica

---

### 💰 **v3.0 - Monetización**

**Estado**: Conceptual

**Features**:

- 🏨 **Links de afiliación** (Booking.com, Airbnb)
- ✈️ **Búsqueda de vuelos** (Skyscanner API)
- 🎫 **Booking de actividades** (GetYourGuide)
- 💎 **Versión Premium** (más destinos, sin ads)
- 📊 **Dashboard de usuario**

**Valor**: Modelo de negocio sostenible

---

### 🌍 **v3.5 - Expansión**

**Estado**: Visión a largo plazo

**Features**:

- 🌐 **Multi-idioma** (i18n)
- 📱 **App móvil nativa** (React Native)
- 🤝 **Comunidad de viajeros**
- ⭐ **Reviews y ratings**
- 🎨 **Temas personalizables**

**Valor**: Alcance global y engagement

---

## � Métricas de Producto (Objetivos)

### Engagement

- **Tiempo en formulario**: < 90 segundos
- **Tasa de completación**: > 70%
- **Tasa de rebote**: < 40%
- **Páginas por sesión**: > 2

### Calidad

- **Satisfacción (CSAT)**: > 4/5
- **Itinerarios útiles**: > 80% (feedback)
- **Errores de generación**: < 5%

### Adopción (Futuro)

- **Usuarios mensuales**: 10,000 (año 1)
- **Itinerarios generados**: 5,000/mes
- **Retención**: 20% regresa en 30 días

---

## � Aprendizajes y Evolución

### Hipótesis Iniciales

- **H1**: Los usuarios prefieren rapidez sobre control total ✅ **VALIDAR**
- **H2**: IA puede generar itinerarios útiles sin intervención humana ✅ **VALIDAR**
- **H3**: Un formulario largo no es problema si el valor es claro ⏳ **PENDIENTE**

### Decisiones de Producto Clave

**Decidimos usar IA generativa en vez de contenido estático porque**:

- ✅ Infinita escalabilidad (cualquier destino del mundo)
- ✅ Siempre actualizado (IA tiene conocimiento reciente)
- ✅ Personalización real (no templates)
- ⚠️ Compromiso: Costo de API, calidad variable

**Decidimos no requerir registro porque**:

- ✅ Menor fricción = más usuarios prueban
- ✅ MVP más rápido de desarrollar
- ✅ Privacy-friendly
- ⚠️ Compromiso: No podemos rastrear usuarios, no hay favoritos

---

## 🤝 Stakeholders y Roles

### Equipo Core

- **Product Owner**: Define visión y prioridades
- **Developer**: @devlitus - Implementación full-stack
- **AI/ML**: Configuración y optimización de Gemini AI

### Usuarios de Testing

- Beta testers (mínimo 10 personas)
- Feedback continuo en cada versión

---

## 📞 Contacto

- **Repository**: github.com/devlitus/travel-web
- **Branch**: develop
- **Documentation**: Ver `business-rules.md` para especificaciones técnicas

---

**Para información técnica, implementación y reglas de negocio**, consultar:

- 📋 [`business-rules.md`](./.github/business-rules.md) - Especificaciones técnicas
- 💻 [`copilot-instructions.md`](./.github/copilot-instructions.md) - Guía de desarrollo
