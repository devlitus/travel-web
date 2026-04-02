# Testing Guide

Este documento describe cómo ejecutar y escribir tests en el proyecto travel-web.

## Framework de Testing

Este proyecto utiliza [Vitest](https://vitest.dev/) como framework de testing. Vitest es rápido, moderno y compatible con TypeScript.

## Ejecutar Tests

### Ejecutar todos los tests

```bash
npm test
```

Este comando ejecutará todos los tests en modo watch (se re-ejecutan automáticamente cuando cambias archivos).

### Ejecutar tests una sola vez

```bash
npm test -- --run
```

### Ejecutar tests con interfaz UI

```bash
npm run test:ui
```

Esto abrirá una interfaz web interactiva donde puedes ver y ejecutar tests individualmente.

### Generar reporte de cobertura

```bash
npm run test:coverage
```

Esto generará un reporte de cobertura de código en la carpeta `coverage/`.

## Estructura de Tests

Los tests están organizados junto a los archivos que prueban:

```
src/
├── utils/
│   ├── cache.ts
│   ├── cache.test.ts
│   ├── clientCache.ts
│   └── clientCache.test.ts
└── components/
    └── TravelForm/
        ├── formHandler.ts
        ├── formHandler.test.ts
        ├── searchHandler.ts
        └── searchHandler.test.ts
```

## Componentes Testeados

### 1. MemoryCache (`src/utils/cache.test.ts`)

Tests para el sistema de cache en memoria:
- ✅ Operaciones básicas (set, get, has, delete, clear)
- ✅ Expiración y TTL (Time To Live)
- ✅ Cleanup de elementos expirados
- ✅ Estadísticas del cache
- ✅ Funciones de utilidad (generateETag, generateCacheKey)

### 2. ClientCache (`src/utils/clientCache.test.ts`)

Tests para el cache del lado del cliente (localStorage):
- ✅ Operaciones CRUD con localStorage
- ✅ Manejo de expiración
- ✅ Separación de prefijos
- ✅ Función debounce
- ✅ Función hashString
- ✅ Manejo de errores

### 3. FormHandler (`src/components/TravelForm/formHandler.test.ts`)

Tests para el manejo del formulario de viaje:
- ✅ Obtención de datos del formulario
- ✅ Guardado en cache (con debounce)
- ✅ Carga desde cache
- ✅ Manejo de actividades seleccionadas
- ✅ Integración con DOM

### 4. SearchHandler (`src/components/TravelForm/searchHandler.test.ts`)

Tests para el manejo de búsquedas:
- ✅ Verificación de cache
- ✅ Guardado de resultados
- ✅ Construcción de URLs de redirección
- ✅ Envío de búsquedas a la API (con mocks)
- ✅ Manejo de errores de red

## Escribir Nuevos Tests

### Estructura básica de un test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup antes de cada test
  });

  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Mocking

#### Mock de fetch

```typescript
import { vi } from 'vitest';

global.fetch = vi.fn();

(global.fetch as any).mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: 'test' })
});
```

#### Mock de timers

```typescript
import { vi } from 'vitest';

vi.useFakeTimers();
vi.advanceTimersByTime(1000); // Avanzar 1 segundo
vi.useRealTimers();
```

#### Mock de localStorage

Vitest con happy-dom incluye un mock de localStorage automáticamente. Solo necesitas limpiarlo:

```typescript
beforeEach(() => {
  localStorage.clear();
});
```

### Assertions comunes

```typescript
// Igualdad
expect(value).toBe(expected);
expect(object).toEqual(expectedObject);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Números
expect(number).toBeGreaterThan(5);
expect(number).toBeLessThan(10);

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Funciones
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(2);
```

## Mejores Prácticas

1. **Nombres descriptivos**: Los nombres de los tests deben describir claramente qué se está probando
2. **Tests independientes**: Cada test debe poder ejecutarse de forma independiente
3. **Arrange-Act-Assert**: Organiza tus tests en estas tres secciones
4. **Un concepto por test**: Cada test debe verificar una sola cosa
5. **Cleanup**: Limpia el estado después de cada test (localStorage, mocks, etc.)
6. **Mock externo**: Mockea dependencias externas (APIs, localStorage, timers)

## Cobertura de Código

El objetivo es mantener una cobertura de código superior al 80% para los componentes principales.

Para ver el reporte de cobertura:

```bash
npm run test:coverage
open coverage/index.html
```

## Debugging Tests

### En VSCode

1. Añade un breakpoint en tu test
2. Ejecuta "Debug Test" desde el CodeLens
3. O usa la configuración de debug de VSCode

### En el navegador

```bash
npm run test:ui
```

Luego abre las DevTools del navegador para debuggear.

## CI/CD

Los tests se ejecutan automáticamente en cada push a través de GitHub Actions (si está configurado).

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vitest UI](https://vitest.dev/guide/ui.html)
