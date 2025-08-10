# Sistema de Cache - Travel Web

Este proyecto implementa un sistema de cache multicapa para optimizar el rendimiento y la experiencia del usuario.

## 🚀 Características del Sistema de Cache

### 1. Cache del Servidor (Memory Cache)

- **Ubicación**: `src/utils/cache.ts`
- **Uso**: APIs del servidor (búsquedas de viajes, imágenes de Unsplash)
- **TTL**: Configurable por endpoint
- **Beneficios**: Reduce llamadas a APIs externas costosas

### 2. Cache del Cliente (LocalStorage)

- **Ubicación**: `src/utils/clientCache.ts`
- **Uso**: Formularios, búsquedas frecuentes
- **TTL**: Configurable, por defecto 30 minutos
- **Beneficios**: Persistencia entre sesiones, respuestas instantáneas

### 3. Cache de Assets (HTTP Headers)

- **Configuración**: `vercel.json`, `astro.config.mjs`
- **Uso**: CSS, JS, imágenes, assets estáticos
- **TTL**: 1 año para assets estáticos, 1 día para imágenes
- **Beneficios**: Carga más rápida, menos transferencia de datos

## 📊 Implementación por Endpoint

### API Search (`/api/search`)

```typescript
// Cache en memoria del servidor: 1 hora
// Headers HTTP: 1 hora browser, 6 horas CDN
const cacheKey = generateCacheKey("search", validatedData);
const cachedResult = travelCache.get(cacheKey);
```

### API Unsplash (`/api/unsplash-image`)

```typescript
// Cache en memoria del servidor: 24 horas
// Headers HTTP: 1 día
const cacheKey = generateCacheKey("unsplash", { destination });
const cachedImage = imageCache.get(cacheKey);
```

### Formulario de Viajes

```typescript
// LocalStorage: 24 horas para datos del formulario
// LocalStorage: 30 minutos para resultados de búsqueda
formCache.set("last-form-data", completeFormData, 24 * 60 * 60 * 1000);
searchCache.set(`search-${searchKey}`, result, 30 * 60 * 1000);
```

## 🛠️ Utilidades de Cache

### Clases Principales

#### `MemoryCache`

```typescript
const cache = new MemoryCache();
cache.set(key, data, ttlSeconds);
const data = cache.get(key);
cache.cleanup(); // Limpia elementos expirados
```

#### `ClientCache`

```typescript
const clientCache = new ClientCache("prefix");
clientCache.set(key, data, ttlMs);
const data = clientCache.get(key);
```

### Funciones Auxiliares

#### `generateCacheKey()`

```typescript
const key = generateCacheKey("search", {
  destination: "París",
  budget: "medium",
});
// Resultado: "search:budget=medium&destination=Par%C3%ADs"
```

#### `generateETag()`

```typescript
const etag = generateETag(responseData);
// Genera un hash único para validación de cache
```

## 🔧 Configuración de Headers

### Assets Estáticos

```json
{
  "source": "/assets/(.*)",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```

### APIs

```json
{
  "source": "/api/search",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=3600, s-maxage=21600"
    }
  ]
}
```

## 📈 Beneficios de Performance

### Antes del Cache

- Cada búsqueda: ~2-5 segundos (llamada a Gemini AI)
- Cada imagen: ~500ms-1s (llamada a Unsplash)
- Assets: Descarga completa en cada visita

### Después del Cache

- Búsquedas repetidas: ~50-100ms (desde cache)
- Imágenes repetidas: ~10-50ms (desde cache)
- Assets: Carga desde cache del navegador
- Formularios: Restauración instantánea

## 🧹 Gestión de Cache

### Limpieza Automática

```typescript
import { cacheManager } from "./utils/cacheManager";

// Limpieza automática cada 30 minutos
cacheManager.startAutoCleanup(30);

// Estadísticas de cache
const stats = cacheManager.getCacheStats();
console.log(stats);

// Limpieza manual
cacheManager.performCleanup();
```

### Monitoreo

```typescript
// En las DevTools del navegador
console.log("Cache stats:", {
  travel: travelCache.getStats(),
  image: imageCache.getStats(),
  search: searchCache.getStats(),
  form: formCache.getStats(),
});
```

## 🎯 Estrategias de Cache por Tipo de Dato

| Tipo de Dato         | Estrategia     | TTL        | Ubicación   |
| -------------------- | -------------- | ---------- | ----------- |
| Itinerarios de viaje | Memoria + HTTP | 1 hora     | Servidor    |
| Imágenes de destinos | Memoria + HTTP | 24 horas   | Servidor    |
| Datos de formulario  | LocalStorage   | 24 horas   | Cliente     |
| Búsquedas frecuentes | LocalStorage   | 30 minutos | Cliente     |
| Assets estáticos     | HTTP Headers   | 1 año      | CDN/Browser |
| Páginas HTML         | HTTP Headers   | 24 horas   | CDN         |

## 🚨 Consideraciones

### Memoria del Servidor

- Los caches en memoria se limpian automáticamente
- Límite recomendado: ~100MB por cache
- Monitorear uso con `getStats()`

### LocalStorage del Cliente

- Límite del navegador: ~5-10MB
- Se limpia automáticamente al expirar
- Fallback si localStorage no está disponible

### Headers HTTP

- Configurados para Vercel en `vercel.json`
- Diferentes TTL según tipo de contenido
- ETags para validación eficiente

## 🔍 Debug y Troubleshooting

### Headers de Debug

- `X-Cache: HIT|MISS` - Indica si se usó cache
- `ETag` - Hash único para validación
- `Cache-Control` - Configuración de cache

### Logs del Sistema

```typescript
// Los caches logean automáticamente:
// "Cache HIT para: search:destination=paris&budget=medium"
// "Cache MISS para: search:destination=tokyo&budget=high"
// "Guardado en cache: search:destination=roma&budget=low"
```

### Comandos Útiles

```typescript
// Limpiar todos los caches
travelCache.clear();
imageCache.clear();
searchCache.clear();
formCache.clear();

// Ver estadísticas
console.log(travelCache.getStats());
```

## 🌟 Próximas Mejoras

1. **Cache distribuido**: Redis para múltiples instancias
2. **Cache de Service Worker**: Funcionalidad offline
3. **Predicción de cache**: Precargar rutas populares
4. **Métricas avanzadas**: Tracking de hit/miss rates
5. **Cache warming**: Precarga automática de datos
