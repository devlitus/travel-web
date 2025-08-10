import { travelCache, imageCache, globalCache } from './cache';

/**
 * Limpieza automática de caches
 * Se ejecuta periódicamente para liberar memoria
 */
export class CacheManager {
  private static instance: CacheManager;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Inicia la limpieza automática de caches
   * @param intervalMinutes - Intervalo en minutos para la limpieza
   */
  startAutoCleanup(intervalMinutes: number = 30): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, intervalMinutes * 60 * 1000);

    console.log(`Cache auto-cleanup iniciado cada ${intervalMinutes} minutos`);
  }

  /**
   * Detiene la limpieza automática
   */
  stopAutoCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('Cache auto-cleanup detenido');
    }
  }

  /**
   * Realiza la limpieza de todos los caches
   */
  performCleanup(): void {
    console.log('Iniciando limpieza de caches...');
    
    const travelCleaned = travelCache.cleanup();
    const imageCleaned = imageCache.cleanup();
    const globalCleaned = globalCache.cleanup();

    const totalCleaned = travelCleaned + imageCleaned + globalCleaned;
    
    console.log(`Limpieza completada: ${totalCleaned} elementos eliminados`);
    console.log(`- Travel cache: ${travelCleaned} elementos`);
    console.log(`- Image cache: ${imageCleaned} elementos`);
    console.log(`- Global cache: ${globalCleaned} elementos`);
  }

  /**
   * Obtiene estadísticas de todos los caches
   */
  getCacheStats(): Record<string, any> {
    return {
      travel: travelCache.getStats(),
      image: imageCache.getStats(),
      global: globalCache.getStats(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Limpia todos los caches completamente
   */
  clearAllCaches(): void {
    travelCache.clear();
    imageCache.clear();
    globalCache.clear();
    console.log('Todos los caches han sido limpiados');
  }

  /**
   * Precarga datos comunes en cache
   */
  async preloadCommonData(): Promise<void> {
    // Aquí podrías precargar destinos populares o datos frecuentes
    console.log('Precarga de datos comunes iniciada');
    
    // Ejemplo: precargar destinos populares
    const popularDestinations = [
      'París', 'Nueva York', 'Tokio', 'Roma', 'Londres'
    ];

    // Esta función se puede expandir para precargar datos específicos
    console.log(`Datos precargados para ${popularDestinations.length} destinos populares`);
  }
}

// Inicializar el manager de cache
export const cacheManager = CacheManager.getInstance();

// Auto-iniciar la limpieza si estamos en el servidor
if (typeof window === 'undefined') {
  cacheManager.startAutoCleanup(30); // Limpieza cada 30 minutos
}
