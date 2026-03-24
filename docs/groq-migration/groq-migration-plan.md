# Plan de Migración: Google Gemini → Groq (AI SDK)

## 1. Executive Summary

- **Feature name**: Migración de proveedor de IA
- **Brief description**: Reemplazar la librería `@google/genai` (Google Gemini) por `@ai-sdk/groq` (Vercel AI SDK con Groq) para la generación de itinerarios de viaje
- **System impact**: Alto - Afecta la funcionalidad principal de generación de itinerarios
- **Complexity estimate**: `Medium`

---

## 2. Current Context Analysis

### 2.1 Archivos Relevantes

| Archivo | Propósito |
|---------|-----------|
| `src/pages/api/search.ts` | Endpoint principal que usa Gemini para generar itinerarios |
| `src/utils/systemInstructions.ts` | System prompt para el modelo de IA |
| `src/utils/transformMarkdownToJson.ts` | Parser de respuesta JSON del modelo |
| `src/utils/errors.ts` | Clases de error personalizadas |
| `src/utils/errorHandler.ts` | Wrapper para servicios externos |
| `package.json` | Dependencia actual: `@google/genai: ^1.10.0` |
| `.env` / `.env.example` | Variable `GEMINI_API_KEY` |

### 2.2 Implementación Actual

```typescript
// src/pages/api/search.ts (líneas 3, 77-96)
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: systemInstruction + "\n\n" + query,
  config: {
    temperature: 0.1,
    maxOutputTokens: 8192,
    candidateCount: 1,
  },
});
const text = response.text;
```

### 2.3 Patrones del Proyecto

- **Error Handling**: Usa `handleExternalService()` wrapper y clases de error tipadas
- **Cache**: Sistema dual con LRU server-side y localStorage client-side
- **Validación**: Zod para input, validación manual para output de IA
- **API Route Pattern**: Documentado en CLAUDE.md (validate → parse → cache → call → validate response → cache → return)

### 2.4 Dependencias Actuales

```json
{
  "@google/genai": "^1.10.0"
}
```

---

## 3. Technical Design

### 3.1 Arquitectura Propuesta

```
[User Form] → [/api/search] → [Groq API via @ai-sdk/groq] → [JSON Response] → [Validation] → [Cache] → [Client]
```

La arquitectura general se mantiene igual. Solo cambia el proveedor de IA interno.

### 3.2 Nuevas Dependencias

```json
{
  "ai": "^4.x",
  "@ai-sdk/groq": "^2.x"
}
```

### 3.3 Cambios de Configuración

| Actual | Nuevo |
|--------|-------|
| `GEMINI_API_KEY` | `GROQ_API_KEY` |
| `gemini-2.0-flash` | `llama-3.3-70b-versatile` (recomendado) |

### 3.4 Modelos de Groq Disponibles

| Modelo | Características | Recomendación |
|--------|-----------------|---------------|
| `llama-3.3-70b-versatile` | Balance calidad/velocidad | **Recomendado para producción** |
| `llama-3.1-8b-instant` | Muy rápido, menos capaz | Desarrollo/pruebas |
| `gemma2-9b-it` | Buen rendimiento general | Alternativa |
| `deepseek-r1-distill-llama-70b` | Soporte de reasoning | Tareas complejas |

### 3.5 Diferencias de API

**Google Gemini (`@google/genai`):**
```typescript
const ai = new GoogleGenAI({ apiKey });
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: systemPrompt + "\n\n" + userPrompt,  // Concatenado
  config: { temperature, maxOutputTokens, candidateCount }
});
const text = response.text;
```

**Groq (`@ai-sdk/groq` + `ai`):**
```typescript
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const { text } = await generateText({
  model: groq('llama-3.3-70b-versatile'),
  system: systemPrompt,     // Separado (mejor práctica)
  prompt: userPrompt,
  temperature: 0.1,
  maxOutputTokens: 8192,
});
```

### 3.6 Mapeo de Parámetros

| Gemini | Groq/AI SDK |
|--------|-------------|
| `model` | `model: groq('model-id')` |
| `contents` | `system` + `prompt` (separados) |
| `config.temperature` | `temperature` |
| `config.maxOutputTokens` | `maxOutputTokens` |
| `config.candidateCount` | No necesario (default 1) |
| `response.text` | Destructuring: `{ text }` |

---

## 4. Implementation Steps

### Step 1: Instalar Nuevas Dependencias

- **File**: `package.json`
- **Action**: Modify
- **Description**: Agregar `ai` y `@ai-sdk/groq`, remover `@google/genai`
- **Command**:
  ```bash
  npm uninstall @google/genai
  npm install ai @ai-sdk/groq
  ```
- **Dependencies**: Ninguna

### Step 2: Actualizar Variables de Entorno

- **File**: `.env` y `.env.example`
- **Action**: Modify
- **Description**: Reemplazar `GEMINI_API_KEY` por `GROQ_API_KEY`
- **Reference Code**: N/A
- **Dependencies**: Step 1

**Contenido nuevo de `.env.example`:**
```env
GROQ_API_KEY=           # Groq API key (get from console.groq.com)
UNSPLASH_ACCESS_KEY=    # Unsplash API key for destination images
```

### Step 3: Modificar System Instructions

- **File**: `src/utils/systemInstructions.ts`
- **Action**: Modify
- **Description**: Convertir función para retornar solo el system prompt (sin el query embebido)
- **Reference Code**: Archivo actual
- **Dependencies**: Ninguna

**Cambios:**
- Renombrar función a `getTravelSystemInstruction()` (sin parámetros)
- Remover interpolación de `${query}` del template
- Retornar solo las instrucciones del sistema

```typescript
// ANTES
export const getTravelSystemInstruction = (query: string) => `...${query}...`;

// DESPUÉS
export const getTravelSystemInstruction = () => `...`; // Sin ${query}
```

### Step 4: Refactorizar API Route Principal

- **File**: `src/pages/api/search.ts`
- **Action**: Modify
- **Description**: Reemplazar implementación de Gemini por Groq usando AI SDK
- **Reference Code**: Implementación actual en líneas 3, 37-97
- **Dependencies**: Steps 1, 2, 3

**Cambios principales:**

```typescript
// ANTES (línea 3)
import { GoogleGenAI } from "@google/genai";

// DESPUÉS
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
```

```typescript
// ANTES (líneas 37-38)
const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;
validateApiKeys({ GEMINI_API_KEY });

// DESPUÉS
const GROQ_API_KEY = import.meta.env.GROQ_API_KEY;
validateApiKeys({ GROQ_API_KEY });
```

```typescript
// ANTES (líneas 77-97)
const text = await handleExternalService('Gemini AI', async () => {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const model = "gemini-2.0-flash";
  const systemInstruction = getTravelSystemInstruction(query);

  const response = await ai.models.generateContent({
    model: model,
    contents: systemInstruction + "\n\n" + query,
    config: {
      temperature: 0.1,
      maxOutputTokens: 8192,
      candidateCount: 1,
    },
  });

  if (!response.text) {
    throw new InvalidResponseError('Gemini AI', 'No se recibió respuesta válida');
  }

  return response.text;
});

// DESPUÉS
const text = await handleExternalService('Groq AI', async () => {
  const systemInstruction = getTravelSystemInstruction();

  const { text: responseText } = await generateText({
    model: groq('llama-3.3-70b-versatile'),
    system: systemInstruction,
    prompt: query,
    temperature: 0.1,
    maxOutputTokens: 8192,
  });

  if (!responseText) {
    throw new InvalidResponseError('Groq AI', 'No se recibió respuesta válida');
  }

  return responseText;
});
```

### Step 5: Actualizar Clases de Error (Referencias)

- **File**: `src/utils/errors.ts`
- **Action**: Modify (optional)
- **Description**: Actualizar comentario de documentación que menciona "Gemini"
- **Reference Code**: Línea 57
- **Dependencies**: Step 4

```typescript
// ANTES (línea 57)
/**
 * Error de servicio externo (Gemini, Unsplash, etc.)

// DESPUÉS
/**
 * Error de servicio externo (Groq, Unsplash, etc.)
```

### Step 6: Actualizar CLAUDE.md

- **File**: `.claude/CLAUDE.md`
- **Action**: Modify
- **Description**: Actualizar documentación para reflejar el nuevo proveedor de IA
- **Reference Code**: Secciones "Environment Variables", "AI Integration Flow", "Gemini Prompt Engineering"
- **Dependencies**: Steps 1-5

**Cambios:**
- Renombrar `GEMINI_API_KEY` a `GROQ_API_KEY`
- Actualizar "Gemini API" a "Groq API"
- Actualizar sección "Gemini Prompt Engineering" a "Groq/AI SDK Integration"

### Step 7: Crear/Actualizar .env.example

- **File**: `.env.example`
- **Action**: Modify
- **Description**: Documentar la nueva variable de entorno requerida
- **Dependencies**: Step 2

---

## 5. Testing Plan

### 5.1 Tests Unitarios

No se requieren nuevos tests unitarios ya que los existentes para `transformMarkdownToJson` siguen siendo válidos.

### 5.2 Tests de Integración

| Test Case | Descripción | Archivo |
|-----------|-------------|---------|
| API Response Format | Verificar que la respuesta de Groq tiene el mismo formato | Manual |
| Error Handling | Verificar que errores de Groq se manejan correctamente | Manual |
| Cache Integration | Verificar que el cache funciona igual | Manual |

### 5.3 Tests Manuales Requeridos

1. **Happy Path**: Enviar búsqueda válida y verificar itinerario completo
2. **Validación de campos**: Verificar que todos los campos obligatorios están presentes:
   - `destination_name`
   - `country`
   - `duration_days`
   - `daily_plan` (con ≥2 actividades por día)
   - `budget_overview` (con todos los subcampos)
   - `essential_travel_tips` (con ≥5 tips)
3. **Error sin API key**: Verificar `ConfigurationError` cuando falta `GROQ_API_KEY`
4. **Rate limiting**: Verificar manejo de errores 429 de Groq
5. **Timeout**: Verificar comportamiento con respuestas lentas

### 5.4 Comandos de Test

```bash
# Tests existentes (deben seguir pasando)
npm test

# Test manual del endpoint
curl -X POST http://localhost:4321/api/search \
  -H "Content-Type: application/json" \
  -d '{"destination":"Barcelona","budget":"medium","duration":"weekend","travelStyle":"cultural","accommodation":"hotel","season":"spring","activities":["cultura","gastronomía"]}'
```

---

## 6. Affected Files

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Cambiar dependencias: `-@google/genai`, `+ai`, `+@ai-sdk/groq` |
| `.env` | Modify | `GEMINI_API_KEY` → `GROQ_API_KEY` |
| `.env.example` | Modify | Documentar nueva variable de entorno |
| `src/pages/api/search.ts` | Modify | Refactorizar llamada a IA usando AI SDK |
| `src/utils/systemInstructions.ts` | Modify | Remover parámetro `query`, retornar solo system prompt |
| `src/utils/errors.ts` | Modify | Actualizar comentario de documentación (opcional) |
| `.claude/CLAUDE.md` | Modify | Actualizar documentación del proyecto |

---

## 7. Additional Considerations

### 7.1 Riesgos Potenciales

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| Diferencias en formato de respuesta | Media | El system prompt está bien estructurado, pero Groq podría generar respuestas ligeramente diferentes |
| Rate limiting de Groq | Baja | Groq tiene límites generosos, pero monitorear en producción |
| Latencia diferente | Baja | Groq es generalmente más rápido que Gemini |
| Costos | Variable | Verificar pricing de Groq vs Gemini para el volumen esperado |

### 7.2 Ventajas de la Migración

1. **Velocidad**: Groq usa hardware LPU especializado, significativamente más rápido
2. **Vercel AI SDK**: Mejor integración con el ecosistema Vercel (ya se usa para deployment)
3. **API Unificada**: El AI SDK permite cambiar de proveedor fácilmente en el futuro
4. **System Prompt Separado**: Mejor práctica que concatenar prompts

### 7.3 Rollback Plan

Si la migración falla:
1. Revertir `package.json` a versión anterior
2. Restaurar `.env` con `GEMINI_API_KEY`
3. Revertir `src/pages/api/search.ts`
4. Ejecutar `npm install`

### 7.4 Notas para el Implementador

1. **Obtener API Key**: Registrarse en [console.groq.com](https://console.groq.com) para obtener `GROQ_API_KEY`
2. **Modelo recomendado**: `llama-3.3-70b-versatile` para producción por su balance calidad/velocidad
3. **Alternativa rápida**: `llama-3.1-8b-instant` para desarrollo/testing (más rápido pero menos capaz)
4. **Verificar output**: El primer deployment debe verificar que el JSON generado pasa todas las validaciones existentes
5. **Monitoreo**: Revisar logs después del deployment para detectar errores de parsing

### 7.5 Mejoras Futuras Relacionadas

- Implementar `streamText` para respuestas en streaming (mejor UX)
- Usar `generateObject` con schema Zod para validación automática
- Agregar soporte multi-modelo (fallback a otro modelo si uno falla)

---

## Referencias

- [Groq AI SDK Documentation](https://ai-sdk.dev/providers/ai-sdk-providers/groq)
- [Vercel AI SDK Core](https://ai-sdk.dev/docs/introduction)
- [Groq Console](https://console.groq.com)
- [npm @ai-sdk/groq](https://www.npmjs.com/package/@ai-sdk/groq)
