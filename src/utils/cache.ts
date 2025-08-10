interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Cache en memoria para almacenar datos temporalmente
 * Útil para APIs y datos que no cambian frecuentemente
 */
export class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();

  /**
   * Almacena un elemento en el cache
   * @param key - Clave única para el elemento
   * @param data - Datos a almacenar
   * @param ttlSeconds - Tiempo de vida en segundos (por defecto 1 hora)
   */
  set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + (ttlSeconds * 1000)
    });
  }

  /**
   * Obtiene un elemento del cache
   * @param key - Clave del elemento
   * @returns Los datos almacenados o null si no existe o expiró
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  /**
   * Verifica si un elemento existe y no ha expirado
   * @param key - Clave del elemento
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Elimina un elemento específico del cache
   * @param key - Clave del elemento a eliminar
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Limpia elementos expirados del cache
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    return cleaned;
  }
}

/**
 * Genera un ETag simple basado en el contenido
 * @param data - Datos para generar el hash
 */
export function generateETag(data: any): string {
  const content = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

/**
 * Genera una clave de cache basada en múltiples parámetros
 * @param prefix - Prefijo para la clave
 * @param params - Parámetros para incluir en la clave
 */
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(String(params[key]))}`)
    .join('&');
  
  return `${prefix}:${sortedParams}`;
}

/**
 * Headers de cache comunes para diferentes tipos de respuesta
 */
export const CACHE_HEADERS = {
  // Para APIs que cambian poco (1 hora browser, 6 horas CDN)
  API_LONG: {
    'Cache-Control': 'public, max-age=3600, s-maxage=21600',
    'Vary': 'Accept-Encoding'
  },
  
  // Para APIs que cambian frecuentemente (5 minutos browser, 1 hora CDN)
  API_SHORT: {
    'Cache-Control': 'public, max-age=300, s-maxage=3600',
    'Vary': 'Accept-Encoding'
  },
  
  // Para assets estáticos (1 año)
  STATIC: {
    'Cache-Control': 'public, max-age=31536000, immutable'
  },
  
  // Para imágenes (1 día)
  IMAGES: {
    'Cache-Control': 'public, max-age=86400'
  },
  
  // Sin cache
  NO_CACHE: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
} as const;

// Instancia global del cache de memoria
export const globalCache = new MemoryCache();

// Cache específico para búsquedas de viajes
export const travelCache = new MemoryCache();

// Cache para imágenes de Unsplash
export const imageCache = new MemoryCache();
