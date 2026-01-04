# Plan de Implementación: Configuración de API Key de Groq con Vercel AI SDK

## 📌 Resumen Ejecutivo

- **Feature**: Configuración correcta de la API key de Groq en Astro con Vercel AI SDK
- **Descripción**: Solucionar el problema donde `GROQ_API_KEY` no se lee correctamente de las variables de entorno en Astro SSR
- **Impacto**: Crítico - La API de búsqueda no funciona sin la API key configurada correctamente
- **Complejidad**: `Baja`

---

## 🔍 Análisis del Contexto Actual

### Archivos relevantes existentes

| Archivo                   | Propósito                            |
| ------------------------- | ------------------------------------ |
| `src/pages/api/search.ts` | Endpoint principal que usa Groq AI   |
| `.env.development`        | Variables de entorno para desarrollo |
| `.env`                    | Variables de entorno base            |
| `astro.config.mjs`        | Configuración de Astro               |

### Problema identificado

El código actual importa `groq` directamente:

```typescript
// src/pages/api/search.ts (línea 3)
import { groq } from "@ai-sdk/groq";
```

Y lo usa así:

```typescript
// src/pages/api/search.ts (línea 76)
model: groq("llama-3.3-70b-versatile"),
```

**El problema**: Según la documentación oficial de `@ai-sdk/groq`, el proveedor por defecto busca `GROQ_API_KEY` en `process.env`. Sin embargo, en Astro SSR, las variables de entorno están disponibles en `import.meta.env`, NO en `process.env`.

### Documentación oficial consultada

#### 1. Vercel AI SDK - Groq Provider (https://ai-sdk.dev/providers/ai-sdk-providers/groq)

> **apiKey** `string`  
> API key that is being sent using the Authorization header. **It defaults to the `GROQ_API_KEY` environment variable.**

Para configuración personalizada:

```typescript
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: "tu-api-key-aqui", // Configuración explícita
});
```

#### 2. Groq Quickstart (https://console.groq.com/docs/quickstart)

> **Using AI SDK:**  
> By default, the provider will look for `GROQ_API_KEY` as the API key.

```javascript
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

const { text } = await generateText({
  model: groq("llama-3.3-70b-versatile"),
  prompt: "Write a vegetarian lasagna recipe for 4 people.",
});
```

#### 3. Astro Environment Variables (documentación consultada previamente)

- Variables SIN prefijo `PUBLIC_` solo están disponibles en servidor
- En Astro, se acceden via `import.meta.env.VARIABLE_NAME`
- `process.env` NO está disponible por defecto en Astro SSR

---

## 📐 Diseño Técnico

### Solución propuesta

Usar `createGroq` en lugar de `groq` para pasar explícitamente la API key desde `import.meta.env`:

```typescript
import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({
  apiKey: import.meta.env.GROQ_API_KEY,
});
```

### Flujo de datos actualizado

```
.env.development
    ↓
import.meta.env.GROQ_API_KEY (Astro SSR)
    ↓
createGroq({ apiKey: ... })
    ↓
groq("llama-3.3-70b-versatile")
    ↓
generateText()
```

---

## 📝 Pasos de Implementación

### Paso 1: Cambiar la importación de groq

- **Archivo**: `src/pages/api/search.ts`
- **Acción**: Modificar
- **Descripción**: Cambiar `import { groq }` por `import { createGroq }`

**Código actual (línea 3)**:

```typescript
import { groq } from "@ai-sdk/groq";
```

**Código nuevo**:

```typescript
import { createGroq } from "@ai-sdk/groq";
```

---

### Paso 2: Crear instancia de Groq con API key explícita

- **Archivo**: `src/pages/api/search.ts`
- **Acción**: Modificar
- **Descripción**: Añadir la creación del cliente Groq después de las importaciones y antes del schema
- **Dependencias**: Paso 1

**Insertar después de las importaciones (aprox. línea 20)**:

```typescript
// Configurar Groq con la API key desde Astro env
const apiKey = import.meta.env.GROQ_API_KEY;

if (!apiKey) {
  console.error(
    "⚠️ GROQ_API_KEY no está configurada en las variables de entorno"
  );
}

const groq = createGroq({
  apiKey: apiKey,
});
```

---

### Paso 3: (Opcional) Agregar validación con mejor feedback

- **Archivo**: `src/pages/api/search.ts`
- **Acción**: Modificar
- **Descripción**: Agregar log en desarrollo para debugging

**Dentro de la función POST, al inicio del try block**:

```typescript
// Debug en desarrollo
if (import.meta.env.DEV) {
  console.log("🔑 GROQ_API_KEY:", apiKey ? "✓ Configurada" : "✗ No encontrada");
}
```

---

### Paso 4: Verificar configuración de variables de entorno

- **Archivo**: `.env.development`
- **Acción**: Verificar
- **Descripción**: Confirmar que la variable está correctamente definida

**Formato correcto**:

```env
GROQ_API_KEY=gsk_xxxxx...
```

**⚠️ Sin comillas** (las comillas pueden causar problemas en algunos entornos)

---

## 📁 Archivos Afectados

| Archivo                   | Acción    | Descripción                                   |
| ------------------------- | --------- | --------------------------------------------- |
| `src/pages/api/search.ts` | Modificar | Cambiar importación y crear instancia de Groq |
| `.env.development`        | Verificar | Confirmar formato correcto de la variable     |
| `.env`                    | Verificar | Confirmar formato correcto de la variable     |

---

## 🧪 Plan de Testing

### Test manual

1. Ejecutar `npm run dev`
2. Verificar en consola que aparece: `🔑 GROQ_API_KEY: ✓ Configurada`
3. Enviar un formulario de búsqueda
4. Verificar que se recibe respuesta exitosa de Groq

### Posibles errores y soluciones

| Error                              | Causa                               | Solución                          |
| ---------------------------------- | ----------------------------------- | --------------------------------- |
| `GROQ_API_KEY no está configurada` | Variable no definida o mal nombrada | Verificar `.env.development`      |
| `401 Unauthorized`                 | API key inválida                    | Regenerar key en console.groq.com |
| `undefined` en runtime             | Comillas en el valor de env         | Remover comillas del valor        |

---

## ⚡ Consideraciones Adicionales

### Diferencias entre entornos

| Entorno           | Variable de entorno            | Notas                          |
| ----------------- | ------------------------------ | ------------------------------ |
| Desarrollo local  | `import.meta.env.GROQ_API_KEY` | Lee de `.env.development`      |
| Vercel Production | `import.meta.env.GROQ_API_KEY` | Configurar en Vercel Dashboard |
| Vercel Preview    | `import.meta.env.GROQ_API_KEY` | Configurar en Vercel Dashboard |

### Seguridad

- ✅ La variable NO tiene prefijo `PUBLIC_`, por lo que solo está disponible en el servidor
- ✅ La API key nunca se expone al cliente
- ⚠️ Asegurarse de que `.env.development` está en `.gitignore`

### Código de referencia final

```typescript
// src/pages/api/search.ts
export const prerender = false;
import type { APIRoute } from "astro";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
// ... resto de imports

// Configurar Groq con la API key desde Astro env
const apiKey = import.meta.env.GROQ_API_KEY;

if (!apiKey) {
  console.error("⚠️ GROQ_API_KEY no está configurada");
}

const groq = createGroq({
  apiKey: apiKey,
});

// ... resto del código usando groq("llama-3.3-70b-versatile")
```

---

## 📚 Referencias

- [Vercel AI SDK - Groq Provider](https://ai-sdk.dev/providers/ai-sdk-providers/groq)
- [Groq Quickstart](https://console.groq.com/docs/quickstart)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
