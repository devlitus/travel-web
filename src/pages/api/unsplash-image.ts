import type { APIRoute } from 'astro';
import { getDestinationHeroImageCached } from '../../utils/unsplashService';
import { generateETag, CACHE_HEADERS } from '../../utils/cache';

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

    // Usar el servicio con cache integrado
    const imageData = await getDestinationHeroImageCached(destination);
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'No se encontraron imágenes para este destino' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify(imageData),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...CACHE_HEADERS.IMAGES,
          'ETag': generateETag(imageData)
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
