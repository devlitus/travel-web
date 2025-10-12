export const prerender = false;
import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';
import { transformMarkdownToJson } from '../../utils/transformMarkdownToJson';
import { travelCache, generateCacheKey, generateETag, CACHE_HEADERS } from '../../utils/cache';
import { getTravelSystemInstruction } from '../../utils/systemInstructions';
import { z } from 'zod';

const travelSchema = z.object({
  destination: z.string().min(1, "El destino es requerido"),
  budget: z.enum(["low", "medium", "high"]),
  duration: z.enum(["weekend", "1-week", "2-weeks", "month"]),
  travelStyle: z.enum(["backpacking", "luxury", "family", "adventure"]),
  accommodation: z.enum(["hotel", "hostel", "apartment", "resort"]),
  season: z.enum(["summer", "winter", "spring", "autumn"]),
  activities: z.array(z.string()).min(1, "Selecciona al menos una actividad"),
});

export const POST: APIRoute = async ({ request }) => {
  const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const data = await request.json();
    const validatedData = travelSchema.parse(data);
    const { destination, budget, duration, travelStyle, accommodation, season, activities } = validatedData;
    
    // Generar clave de cache basada en todos los parámetros
    const cacheKey = generateCacheKey('search', validatedData);
    
    // Verificar cache primero
    const cachedResult = travelCache.get(cacheKey);
    if (cachedResult) {
      return new Response(
        JSON.stringify(cachedResult),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...CACHE_HEADERS.API_LONG,
            'X-Cache': 'HIT',
            'ETag': generateETag(cachedResult)
          } 
        }
      );
    }
    
    const query = `
     Busca ${destination} en ${budget} ${duration} ${travelStyle} ${accommodation} ${season} ${activities}
    `
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Configurar el modelo usando la nueva API
    const model = 'gemini-2.0-flash';
    
    const systemInstruction = getTravelSystemInstruction(query);

    const response = await ai.models.generateContent({
      model: model,
      contents: systemInstruction + "\n\n" + query,
      config: {
        temperature: 0.1,
        maxOutputTokens: 2048,
        candidateCount: 1
      }
    });
    
    const text = response.text;
        
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'No se recibió respuesta válida de Gemini' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Limpiar cualquier texto no deseado de la respuesta
    let cleanedText = text.trim();

    // Elimina cualquier bloque de código markdown al inicio y final
    cleanedText = cleanedText.replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '').trim();
    
    try {
      // Intentar parsear el JSON
      const parsedData = transformMarkdownToJson(cleanedText);
      const itinerary = parsedData.itinerary;

      if (!itinerary) {
        throw new Error("El itinerario no se encontró en la respuesta de la IA.");
      }

      // Asignar imagen vacía por ahora (la generación de imágenes se implementará más tarde)
      itinerary.image = '';

      // Guardar en cache por 1 hora (3600 segundos)
      travelCache.set(cacheKey, parsedData, 3600);

      return new Response(
        JSON.stringify(parsedData),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...CACHE_HEADERS.API_LONG,
            'X-Cache': 'MISS',
            'ETag': generateETag(parsedData)
          } 
        }
      );
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);
      console.error('Texto que se intentó parsear:', cleanedText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Error procesando respuesta de IA',
          rawResponse: text,
          cleanedResponse: cleanedText 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error en la API de búsqueda:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
