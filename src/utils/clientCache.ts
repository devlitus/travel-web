/**
 * Cache del lado del cliente usando localStorage
 * Ideal para búsquedas frecuentes y datos del usuario
 */
export class ClientCache {
  private static readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutos
  private storageAvailable: boolean | null = null;

  constructor(private prefix: string) {}

  /**
   * Obtiene una clave completa con prefijo
   */
  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  /**
   * Verifica si localStorage está disponible (resultado cacheado por instancia)
   */
  private isStorageAvailable(): boolean {
    if (this.storageAvailable !== null) return this.storageAvailable;
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      this.storageAvailable = true;
    } catch {
      this.storageAvailable = false;
    }
    return this.storageAvailable;
  }

  /**
   * Almacena un elemento en localStorage
   */
  set(key: string, data: any, ttlMs: number = ClientCache.DEFAULT_TTL): boolean {
    if (!this.isStorageAvailable()) return false;

    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttlMs
      };

      localStorage.setItem(this.getKey(key), JSON.stringify(item));
      return true;
    } catch (error) {
      console.warn('Error guardando en localStorage:', error);
      return false;
    }
  }

  /**
   * Obtiene un elemento de localStorage
   */
  get<T>(key: string): T | null {
    if (!this.isStorageAvailable()) return null;

    try {
      const stored = localStorage.getItem(this.getKey(key));
      if (!stored) return null;

      const item = JSON.parse(stored);
      
      // Verificar si no ha expirado
      if (Date.now() > item.expiresAt) {
        this.delete(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn('Error leyendo de localStorage:', error);
      this.delete(key);
      return null;
    }
  }

  /**
   * Verifica si un elemento existe y no ha expirado
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Elimina un elemento específico
   */
  delete(key: string): boolean {
    if (!this.isStorageAvailable()) return false;

    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Limpia todos los elementos con este prefijo
   */
  clear(): number {
    if (!this.isStorageAvailable()) return 0;

    let removed = 0;
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.prefix}:`)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      removed++;
    });

    return removed;
  }

  /**
   * Limpia elementos expirados
   */
  cleanup(): number {
    if (!this.isStorageAvailable()) return 0;

    let cleaned = 0;
    const keysToRemove: string[] = [];
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(`${this.prefix}:`)) continue;

      try {
        const stored = localStorage.getItem(key);
        if (!stored) continue;

        const item = JSON.parse(stored);
        if (now > item.expiresAt) {
          keysToRemove.push(key);
        }
      } catch {
        keysToRemove.push(key); // Eliminar elementos corruptos también
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      cleaned++;
    });

    return cleaned;
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats(): { size: number; totalSize: number; keys: string[] } {
    if (!this.isStorageAvailable()) {
      return { size: 0, totalSize: 0, keys: [] };
    }

    const keys: string[] = [];
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.prefix}:`)) {
        keys.push(key);
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
    }

    return {
      size: keys.length,
      totalSize,
      keys
    };
  }
}

/**
 * Debounce function para optimizar búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Genera un hash simple para usar como clave de cache
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Crea una instancia de cache para búsquedas de viajes
 */
export const searchCache = new ClientCache('travel-search');

/**
 * Crea una instancia de cache para formularios
 */
export const formCache = new ClientCache('travel-form');

/**
 * Initializes automatic cache cleanup.
 * Call this once from your app's entry point.
 */
export function initCacheCleanup(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    searchCache.cleanup();
    formCache.cleanup();
  });

  setInterval(() => {
    searchCache.cleanup();
    formCache.cleanup();
  }, 10 * 60 * 1000);
}
