# Plan de Testing: Configuración de API Key de Groq

## 📊 Resumen de Cobertura

| Métrica               | Valor    |
| --------------------- | -------- |
| **Archivos a testear** | 2        |
| **Tests críticos**     | 7        |
| **Tests edge cases**   | 6        |
| **Tests de error**     | 8        |
| **Total tests**       | 21       |
| **Tiempo estimado**    | 15 min   |

---

## 🎯 Funciones/Componentes a Testear

| Función/Componente             | Archivo                      | Prioridad | Razón                                         |
| ------------------------------ | ---------------------------- | --------- | --------------------------------------------- |
| `createGroq configuration`     | `src/pages/api/search.ts`    | 🔴 Alta   | Configuración crítica de API key             |
| `POST handler`                 | `src/pages/api/search.ts`    | 🔴 Alta   | Endpoint principal, manejo de env vars       |
| `generateText with groq`       | `src/pages/api/search.ts`    | 🟠 Media  | Integración SDK, puede fallar sin API key    |
| `apiKey validation flow`       | `src/pages/api/search.ts`    | 🟠 Media  | Log de debug y manejo de claves faltantes    |

---

## 🧪 Casos de Test Detallados

### `createGroq configuration` - src/pages/api/search.ts

**Contexto**: Configuración de la instancia Groq con API key desde `import.meta.env.GROQ_API_KEY`

##### Tests Requeridos:

1. **[CRITICAL] Configuración exitosa con API key válida**
   - **Input**: `GROQ_API_KEY="gsk_valid123..."`
   - **Expected**: Instancia de Groq configurada correctamente
   - **Por qué es necesario**: Es el camino feliz principal

2. **[EDGE] Comportamiento con API key undefined**
   - **Input**: `GROQ_API_KEY=undefined`
   - **Expected**: Instancia de Groq con apiKey undefined
   - **Por qué es necesario**: Debe manejar gracefully la configuración faltante

3. **[EDGE] Comportamiento con API key string vacío**
   - **Input**: `GROQ_API_KEY=""`
   - **Expected**: Instancia de Groq con apiKey vacío
   - **Por qué es necesario**: Variables mal configuradas en .env

4. **[EDGE] API key con espacios en blanco**
   - **Input**: `GROQ_API_KEY="  gsk_key123  "`
   - **Expected**: Debe funcionar (o fallar de manera predecible)
   - **Por qué es necesario**: Errores comunes en configuración .env

---

### `POST handler validation` - src/pages/api/search.ts

**Contexto**: Manejo del endpoint POST incluyendo validación de API key y logging

##### Tests Requeridos:

5. **[CRITICAL] Log de debug en desarrollo con API key configurada**
   - **Input**: `DEV=true, GROQ_API_KEY="valid_key"`
   - **Expected**: Console.log muestra "✓ Configurada"
   - **Por qué es necesario**: Debugging crítico para detectar problemas de configuración

6. **[CRITICAL] Log de debug en desarrollo sin API key**
   - **Input**: `DEV=true, GROQ_API_KEY=undefined`
   - **Expected**: Console.log muestra "✗ No encontrada"
   - **Por qué es necesario**: Alertar sobre configuración faltante

7. **[ERROR] Llamada a generateText sin API key**
   - **Input**: Request válido pero `GROQ_API_KEY=undefined`
   - **Expected**: Error específico del SDK de Groq (401 Unauthorized o similar)
   - **Por qué es necesario**: Validar que el error se propaga correctamente

8. **[ERROR] Llamada a generateText con API key inválida**
   - **Input**: Request válido pero `GROQ_API_KEY="invalid_key"`
   - **Expected**: 401 Unauthorized desde Groq API
   - **Por qué es necesario**: Manejar keys expiradas o incorrectas

---

### `generateText integration` - src/pages/api/search.ts

**Contexto**: Integración con Vercel AI SDK usando la instancia configurada de Groq

##### Tests Requeridos:

9. **[CRITICAL] Generación exitosa con configuración válida**
   - **Input**: Request válido + API key válida
   - **Expected**: Respuesta JSON estructurada de itinerario
   - **Por qué es necesario**: Verificar que la configuración funciona end-to-end

10. **[EDGE] Manejo de respuesta vacía de Groq**
    - **Input**: Request válido pero Groq retorna texto vacío
    - **Expected**: `InvalidResponseError` con mensaje apropiado
    - **Por qué es necesario**: Groq puede fallar silenciosamente

11. **[EDGE] Manejo de respuesta malformada de Groq**
    - **Input**: Request válido pero Groq retorna texto no-JSON
    - **Expected**: `ParseError` con detalles del contenido recibido
    - **Por qué es necesario**: IA puede generar respuestas inconsistentes

12. **[ERROR] Timeout en llamada a Groq**
    - **Input**: Request válido pero Groq API timeout
    - **Expected**: `ExternalServiceError` con timeout info
    - **Por qué es necesario**: Servicios externos pueden ser lentos

---

### `Environment variables behavior` - Configuración de entorno

**Contexto**: Comportamiento del sistema con diferentes configuraciones de variables de entorno

##### Tests Requeridos:

13. **[EDGE] Variable con comillas en valor**
    - **Input**: `GROQ_API_KEY='"gsk_key123"'` (comillas incluidas)
    - **Expected**: Debe funcionar o fallar de manera predecible
    - **Por qué es necesario**: Error común en archivos .env

14. **[EDGE] Variable con caracteres especiales**
    - **Input**: `GROQ_API_KEY="gsk_key/with+special=chars"`
    - **Expected**: Debe manejar correctamente caracteres especiales
    - **Por qué es necesario**: API keys pueden tener caracteres especiales

15. **[CRITICAL] Diferencia entre desarrollo y producción**
    - **Input**: Mismo código en `DEV=false`
    - **Expected**: No debe mostrar logs de debug
    - **Por qué es necesario**: Evitar leak de info en producción

---

### `Error propagation chain` - Manejo de errores

**Contexto**: Validar que los errores se propagan correctamente a través del sistema

##### Tests Requeridos:

16. **[ERROR] Error de configuración se convierte en ConfigurationError**
    - **Input**: API key totalmente ausente
    - **Expected**: Error manejado por `handleApiError` con código apropiado
    - **Por qué es necesario**: Errores deben ser tipados y manejables

17. **[ERROR] Error del SDK se convierte en ExternalServiceError**
    - **Input**: API key inválida que causa error 401 de Groq
    - **Expected**: `ExternalServiceError` con contexto de "Groq AI"
    - **Por qué es necesario**: Distinguir errores de configuración vs servicio

18. **[ERROR] Response malformada se convierte en ParseError**
    - **Input**: Groq retorna texto que no es JSON válido
    - **Expected**: `ParseError` con datos del texto recibido
    - **Por qué es necesario**: Debugging cuando IA genera respuestas malformadas

---

### `Cache integration` - Interacción con sistema de cache

**Contexto**: Validar que el cache funciona correctamente con la nueva configuración

##### Tests Requeridos:

19. **[CRITICAL] Cache hit evita llamada a Groq**
    - **Input**: Request idéntico después de cache válido
    - **Expected**: Response inmediata sin llamar a generateText
    - **Por qué es necesario**: Optimización crítica y reduce uso de API

20. **[EDGE] Cache miss con API key faltante**
    - **Input**: Request sin cache + API key undefined
    - **Expected**: Error antes de intentar llamar a Groq
    - **Por qué es necesario**: Evitar intentos innecesarios sin configuración

21. **[ERROR] Error en cache no afecta configuración de Groq**
    - **Input**: Cache corrupto + API key válida
    - **Expected**: Groq funciona normalmente, ignora cache
    - **Por qué es necesario**: Sistema debe ser resiliente a problemas de cache

---

## 🚫 Tests que NO Son Necesarios

| No testear                           | Razón                                  |
| ------------------------------------ | -------------------------------------- |
| Lógica interna del SDK `@ai-sdk/groq` | Ya está testeada por el vendor         |
| Implementación de `createGroq`       | Es una función de biblioteca           |
| Validación de Zod en travelSchema    | Ya existen tests para esto            |
| Funciones de cache básicas           | Fuera del scope de esta feature       |
| Sistema de errores base              | Ya implementado y testeado previamente |

---

## 📁 Archivos de Test a Crear

| Archivo de Test                          | Tests | Componente que testea                |
| ---------------------------------------- | ----- | ------------------------------------ |
| `groq-api-key-configuration.test.ts`    | 15    | Configuración de Groq con API key    |
| `groq-api-key-integration.test.ts`      | 6     | Integración end-to-end con Groq SDK  |

---

## 🔧 Setup Necesario

### Mocks requeridos:

```typescript
// Mock de import.meta.env para diferentes configuraciones
vi.mock('import.meta.env', () => ({
  GROQ_API_KEY: 'test_key',
  DEV: true
}));

// Mock del SDK de Groq para simular respuestas
vi.mock('@ai-sdk/groq', () => ({
  createGroq: vi.fn(() => mockGroqInstance)
}));

// Mock de generateText para simular llamadas
vi.mock('ai', () => ({
  generateText: vi.fn()
}));
```

### Fixtures necesarios:

```typescript
// API key válida de test
const VALID_TEST_API_KEY = 'gsk_test_valid_key_123';

// API key inválida
const INVALID_TEST_API_KEY = 'invalid_key_123';

// Respuesta válida de Groq
const VALID_GROQ_RESPONSE = {
  text: '{"itinerary": {...}}'
};

// Request válido de test
const VALID_REQUEST_DATA = {
  destination: 'Paris',
  budget: 'medium',
  duration: '1-week',
  travelStyle: 'backpacking',
  accommodation: 'hotel',
  season: 'summer',
  activities: ['Museums']
};
```

### Configuración de entorno de test:

```typescript
// Setup para each test
beforeEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  
  // Reset environment variables
  delete process.env.GROQ_API_KEY;
});

// Cleanup después de each test  
afterEach(() => {
  vi.restoreAllMocks();
});
```

---

## 🎯 Criterios de Éxito

### Cobertura mínima:
- ✅ **100%** de los paths críticos de configuración
- ✅ **85%** de los edge cases identificados  
- ✅ **100%** de los scenarios de error principales

### Validaciones clave:
- ✅ API key se pasa correctamente al SDK
- ✅ Logs de debug funcionan solo en desarrollo
- ✅ Errores se propagan con información útil
- ✅ Sistema funciona con y sin API key (con errores apropiados)
- ✅ Cache no interfiere con configuración

### Performance:
- ✅ Tests ejecutan en < 10 segundos total
- ✅ No llamadas reales a Groq API durante testing
- ✅ Mocking eficiente sin overhead

---

## 💡 Notas de Implementación

### Prioridad de implementación:
1. **Tests críticos** (1-3, 5-7, 9, 15, 19) - Implementar primero
2. **Tests de edge cases** (4, 10-14, 20) - Implementar segundo  
3. **Tests de error** (8, 16-18, 21) - Implementar último

### Consideraciones especiales:
- **Astro SSR Testing**: Los tests deben simular el entorno de Astro correctamente
- **Environment Mocking**: Usar vi.mock para `import.meta.env` no `process.env`
- **SDK Mocking**: Mock completo de `@ai-sdk/groq` para evitar llamadas reales
- **Error Boundary**: Asegurar que todos los errores se capturan y tipifican correctamente

### Debugging durante tests:
- Capturar console.error y console.log para verificar logging
- Verificar que errores incluyen contexto suficiente para debugging
- Validar que stack traces son útiles y no están truncados