import type { APIRoute } from 'astro';
import { getDestinationHeroImage, optimizeUnsplashImage } from '../../utils/unsplashService';
import { imageCache, generateCacheKey, generateETag, CACHE_HEADERS } from '../../utils/cache';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Verificar que el content-type sea correcto
    const contentType = request.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type debe ser application/json' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Obtener el texto del body primero
    const bodyText = await request.text();
    
    if (!bodyText) {
      return new Response(
        JSON.stringify({ error: 'El body de la solicitud está vacío' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'JSON inválido en el body de la solicitud' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { destination } = body;

    if (!destination) {
      return new Response(
        JSON.stringify({ error: 'El parámetro destination es requerido' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generar clave de cache para la imagen
    const cacheKey = generateCacheKey('unsplash', { destination: destination.toLowerCase() });
    
    // Verificar cache primero
    const cachedImage = imageCache.get(cacheKey);
    if (cachedImage) {
      console.log('Cache HIT para imagen:', cacheKey);
      return new Response(
        JSON.stringify(cachedImage),
        {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            ...CACHE_HEADERS.IMAGES,
            'X-Cache': 'HIT',
            'ETag': generateETag(cachedImage)
          },
        }
      );
    }

    console.log('Cache MISS para imagen:', cacheKey);

    // Obtener imagen desde Unsplash
    const imageUrl = await getDestinationHeroImage(destination);
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'No se encontraron imágenes para este destino' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Optimizar la imagen para el uso como background
    const optimizedImageUrl = optimizeUnsplashImage(imageUrl, 1200, 600, 85);

    const responseData = { 
      imageUrl: optimizedImageUrl,
      originalUrl: imageUrl 
    };

    // Guardar en cache por 24 horas (las imágenes cambian poco)
    imageCache.set(cacheKey, responseData, 86400);
    console.log('Imagen guardada en cache:', cacheKey);

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...CACHE_HEADERS.IMAGES,
          'X-Cache': 'MISS',
          'ETag': generateETag(responseData)
        },
      }
    );
  } catch (error) {
    console.error('Error en API de Unsplash:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor al obtener la imagen' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
