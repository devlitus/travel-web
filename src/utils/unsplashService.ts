/**
 * Servicio para integración con Unsplash API
 * Permite buscar imágenes relacionadas con destinos de viaje
 */

const UNSPLASH_ACCESS_KEY = 'ZmX6HByJ876NPUVONgRxlyARjZ8JsWfXH_8EfwqnoSc';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

/**
 * Busca fotos en Unsplash relacionadas con un destino
 * @param destination - Nombre del destino a buscar
 * @param page - Número de página (opcional, por defecto 1)
 * @param perPage - Número de resultados por página (opcional, por defecto 10)
 * @returns Promise con los resultados de la búsqueda
 */
export async function searchDestinationPhotos(
  destination: string,
  page: number = 1,
  perPage: number = 10
): Promise<UnsplashSearchResponse> {
  try {
    const searchQuery = encodeURIComponent(`${destination} travel destination landscape`);
    const url = `${UNSPLASH_API_URL}?query=${searchQuery}&page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error en Unsplash API: ${response.status} ${response.statusText}`);
    }
    
    const data: UnsplashSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al buscar fotos en Unsplash:', error);
    throw new Error('No se pudieron cargar las imágenes del destino');
  }
}

/**
 * Obtiene la primera foto de un destino para usar como imagen principal
 * @param destination - Nombre del destino
 * @returns Promise con la URL de la imagen o null si no se encuentra
 */
export async function getDestinationHeroImage(destination: string): Promise<string | null> {
  try {
    const searchResult = await searchDestinationPhotos(destination, 1, 1);
    
    if (searchResult.results.length > 0) {
      return searchResult.results[0].urls.regular;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener imagen principal:', error);
    return null;
  }
}

/**
 * Genera una URL optimizada de Unsplash con parámetros específicos
 * @param photoUrl - URL base de la foto
 * @param width - Ancho deseado
 * @param height - Alto deseado (opcional)
 * @param quality - Calidad de la imagen (opcional, por defecto 80)
 * @returns URL optimizada
 */
export function optimizeUnsplashImage(
  photoUrl: string,
  width: number,
  height?: number,
  quality: number = 80
): string {
  if (!photoUrl) return '';
  
  const url = new URL(photoUrl);
  url.searchParams.set('w', width.toString());
  url.searchParams.set('q', quality.toString());
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'crop');
  
  if (height) {
    url.searchParams.set('h', height.toString());
  }
  
  return url.toString();
}
