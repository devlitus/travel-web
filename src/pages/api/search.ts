export const prerender = false;
import type { APIRoute } from "astro";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { transformMarkdownToJson } from "../../utils/transformMarkdownToJson";
import {
  travelCache,
  generateCacheKey,
  generateETag,
  CACHE_HEADERS,
} from "../../utils/cache";
import { getTravelSystemInstruction } from "../../utils/systemInstructions";
import { z } from "zod";
import {
  handleApiError,
  validateApiKeys,
  handleExternalService,
} from "../../utils/errorHandler";
import { ParseError, InvalidResponseError } from "../../utils/errors";

// Configurar Groq con la API key desde Astro env
const apiKey: string | undefined = import.meta.env.GROQ_API_KEY;

if (!apiKey) {
  console.error(
    "⚠️ GROQ_API_KEY no está configurada en las variables de entorno"
  );
}

const groq = createGroq({
  apiKey: apiKey,
});

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
  try {
    // Debug en desarrollo
    if (import.meta.env.DEV) {
      console.log(
        "🔑 GROQ_API_KEY:",
        apiKey ? "✓ Configurada" : "✗ No encontrada"
      );
    }

    const data = await request.json();
    const validatedData = travelSchema.parse(data);
    const {
      destination,
      budget,
      duration,
      travelStyle,
      accommodation,
      season,
      activities,
    } = validatedData;

    // Generar clave de cache basada en todos los parámetros
    const cacheKey = generateCacheKey("search", validatedData);

    // Verificar cache primero
    const cachedResult = travelCache.get(cacheKey);
    if (cachedResult) {
      return new Response(JSON.stringify(cachedResult), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...CACHE_HEADERS.API_LONG,
          "X-Cache": "HIT",
          ETag: generateETag(cachedResult),
        },
      });
    }

    const query = `
     Busca ${destination} en ${budget} ${duration} ${travelStyle} ${accommodation} ${season} ${activities}
    `;

    // Llamar a Groq AI con manejo de errores
    const text = await handleExternalService("Groq AI", async () => {
      const systemInstruction = getTravelSystemInstruction();

      // Generar texto con Groq AI
      const { text: responseText } = await generateText({
        model: groq("openai/gpt-oss-120b"),
        system: systemInstruction,
        prompt: query,
        temperature: 0.1,
        maxOutputTokens: 8192, // Aumentado para itinerarios largos
      });

      if (!responseText) {
        throw new InvalidResponseError(
          "Groq AI",
          "No se recibió respuesta válida"
        );
      }

      return responseText;
    });

    // Limpiar cualquier texto no deseado de la respuesta
    let cleanedText = text.trim();

    // Elimina cualquier bloque de código markdown al inicio y final
    cleanedText = cleanedText
      .replace(/^```[a-zA-Z]*\n?/, "")
      .replace(/```\s*$/, "")
      .trim();

    // Intentar parsear el JSON
    let parsedData;
    try {
      parsedData = transformMarkdownToJson(cleanedText);
    } catch (parseError) {
      const error = parseError as Error;
      console.error("Error parseando JSON:", error.message);
      console.error("Longitud de respuesta:", cleanedText.length, "caracteres");
      console.error("Primeros 200 caracteres:", cleanedText.substring(0, 200));
      console.error(
        "Últimos 200 caracteres:",
        cleanedText.substring(cleanedText.length - 200)
      );

      throw new ParseError(
        error.message || "Error procesando respuesta de IA",
        JSON.stringify({
          length: cleanedText.length,
          preview: cleanedText.substring(0, 200) + "...",
          ending: "..." + cleanedText.substring(cleanedText.length - 200),
        })
      );
    }

    const itinerary = parsedData.itinerary;
    if (!itinerary) {
      throw new ParseError(
        "El itinerario no se encontró en la respuesta de la IA",
        cleanedText
      );
    }

    // Validar campos obligatorios
    const requiredFields = [
      "destination_name",
      "country",
      "duration_days",
      "daily_plan",
      "budget_overview",
      "essential_travel_tips",
    ];

    const missingFields = requiredFields.filter((field) => !itinerary[field]);
    if (missingFields.length > 0) {
      throw new ParseError(
        `Respuesta de IA incompleta. Faltan campos obligatorios: ${missingFields.join(", ")}`,
        JSON.stringify({
          received: Object.keys(itinerary),
          missing: missingFields,
        })
      );
    }

    // Validar que daily_plan tenga actividades
    if (Array.isArray(itinerary.daily_plan)) {
      for (const day of itinerary.daily_plan) {
        if (
          !day.activities ||
          !Array.isArray(day.activities) ||
          day.activities.length === 0
        ) {
          throw new ParseError(
            `El día ${day.day || "desconocido"} no tiene actividades definidas`,
            JSON.stringify(day)
          );
        }
      }
    }

    // Validar budget_overview
    const budgetFields = [
      "accommodation",
      "food",
      "activities",
      "transportation",
      "total_estimated_cost",
    ];
    if (itinerary.budget_overview) {
      const missingBudgetFields = budgetFields.filter(
        (field) => !itinerary.budget_overview[field]
      );
      if (missingBudgetFields.length > 0) {
        console.warn(
          "Campos faltantes en budget_overview:",
          missingBudgetFields
        );
      }
    }

    // Asignar imagen vacía por ahora (la generación de imágenes se implementará más tarde)
    itinerary.image = "";

    // Guardar en cache por 1 hora (3600 segundos)
    travelCache.set(cacheKey, parsedData, 3600);

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...CACHE_HEADERS.API_LONG,
        "X-Cache": "MISS",
        ETag: generateETag(parsedData),
      },
    });
  } catch (error) {
    return handleApiError(error, {
      endpoint: "/api/search",
      params: { destination: request.url },
    });
  }
};
