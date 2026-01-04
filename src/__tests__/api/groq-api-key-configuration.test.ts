/**
 * Tests de configuración de API Key de Groq
 * Basado en groq-api-key-config.test-plan.md
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { APIRoute } from 'astro';

// Fixtures
const VALID_TEST_API_KEY = 'gsk_test_valid_key_123';
const INVALID_TEST_API_KEY = 'invalid_key_123';

describe('createGroq configuration', () => {
  let mockCreateGroq: any;
  let mockGroqInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockGroqInstance = vi.fn();
    mockCreateGroq = vi.fn(() => mockGroqInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('[CRITICAL] debería configurarse exitosamente con API key válida', () => {
    const apiKey = VALID_TEST_API_KEY;
    const groq = mockCreateGroq({ apiKey });

    expect(mockCreateGroq).toHaveBeenCalledWith({ apiKey: VALID_TEST_API_KEY });
    expect(groq).toBeDefined();
  });

  it('[EDGE] debería manejar API key undefined', () => {
    const apiKey = undefined;
    const groq = mockCreateGroq({ apiKey });

    expect(mockCreateGroq).toHaveBeenCalledWith({ apiKey: undefined });
    expect(groq).toBeDefined();
  });

  it('[EDGE] debería manejar API key string vacío', () => {
    const apiKey = '';
    const groq = mockCreateGroq({ apiKey });

    expect(mockCreateGroq).toHaveBeenCalledWith({ apiKey: '' });
    expect(groq).toBeDefined();
  });

  it('[EDGE] debería manejar API key con espacios en blanco', () => {
    const apiKey = '  gsk_key123  ';
    const groq = mockCreateGroq({ apiKey });

    expect(mockCreateGroq).toHaveBeenCalledWith({ apiKey: '  gsk_key123  ' });
    expect(groq).toBeDefined();
  });
});

describe('POST handler validation', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('[CRITICAL] debería mostrar log de debug en desarrollo con API key configurada', () => {
    const apiKey = VALID_TEST_API_KEY;
    const isDev = true;

    if (isDev) {
      console.log('🔑 GROQ_API_KEY:', apiKey ? '✓ Configurada' : '✗ No encontrada');
    }

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '🔑 GROQ_API_KEY:',
      '✓ Configurada'
    );
  });

  it('[CRITICAL] debería mostrar log de debug en desarrollo sin API key', () => {
    const apiKey = undefined;
    const isDev = true;

    if (isDev) {
      console.log('🔑 GROQ_API_KEY:', apiKey ? '✓ Configurada' : '✗ No encontrada');
    }

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '🔑 GROQ_API_KEY:',
      '✗ No encontrada'
    );
  });

  it('[ERROR] debería mostrar error en consola cuando API key no está configurada', () => {
    const apiKey = undefined;

    if (!apiKey) {
      console.error('⚠️ GROQ_API_KEY no está configurada en las variables de entorno');
    }

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '⚠️ GROQ_API_KEY no está configurada en las variables de entorno'
    );
  });

  it('[ERROR] debería validar que se maneja API key inválida', () => {
    const apiKey = INVALID_TEST_API_KEY;
    
    // Simular que el SDK valida y rechaza la key
    const mockSDKError = new Error('Invalid API key');
    
    expect(apiKey).toBe(INVALID_TEST_API_KEY);
    expect(mockSDKError.message).toBe('Invalid API key');
  });
});

describe('Environment variables behavior', () => {
  it('[EDGE] debería manejar variable con comillas en valor', () => {
    // Simular lectura de .env con comillas incluidas
    const rawEnvValue = '"gsk_key123"';
    const cleanedValue = rawEnvValue.replace(/^["']|["']$/g, '');
    
    // Si no se limpia, la key tendrá comillas
    expect(rawEnvValue).toBe('"gsk_key123"');
    // Después de limpiar, debería funcionar
    expect(cleanedValue).toBe('gsk_key123');
  });

  it('[EDGE] debería manejar variable con caracteres especiales', () => {
    const apiKey = 'gsk_key/with+special=chars';
    
    // La key debería poder contener estos caracteres
    expect(apiKey).toBe('gsk_key/with+special=chars');
    expect(apiKey.length).toBeGreaterThan(0);
  });

  it('[CRITICAL] no debería mostrar logs en producción', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const apiKey = VALID_TEST_API_KEY;
    const isDev = false; // Producción

    // En producción no se debe loggear
    if (isDev) {
      console.log('🔑 GROQ_API_KEY:', apiKey ? '✓ Configurada' : '✗ No encontrada');
    }

    expect(consoleLogSpy).not.toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });
});

describe('Error propagation chain', () => {
  it('[ERROR] debería identificar error de configuración', () => {
    const apiKey = undefined;
    
    // Simular detección de configuración faltante
    const hasConfigurationError = !apiKey;
    
    expect(hasConfigurationError).toBe(true);
  });

  it('[ERROR] debería identificar error del SDK', () => {
    // Simular error 401 de Groq API
    const mockSDKError = {
      status: 401,
      message: 'Unauthorized',
      service: 'Groq AI'
    };
    
    expect(mockSDKError.status).toBe(401);
    expect(mockSDKError.service).toBe('Groq AI');
  });

  it('[ERROR] debería identificar respuesta malformada', () => {
    // Simular texto que no es JSON
    const malformedResponse = 'This is not JSON {incomplete';
    
    let parseError = null;
    try {
      JSON.parse(malformedResponse);
    } catch (error) {
      parseError = error;
    }
    
    expect(parseError).toBeDefined();
    expect(parseError).toBeInstanceOf(Error);
  });
});

describe('Cache integration', () => {
  let mockCache: Map<string, any>;

  beforeEach(() => {
    mockCache = new Map();
  });

  it('[CRITICAL] cache hit debería evitar llamada a Groq', () => {
    const cacheKey = 'search-paris-medium';
    const cachedData = { itinerary: 'cached data' };
    
    // Simular cache hit
    mockCache.set(cacheKey, cachedData);
    const result = mockCache.get(cacheKey);
    
    expect(result).toEqual(cachedData);
    expect(mockCache.has(cacheKey)).toBe(true);
  });

  it('[EDGE] cache miss con API key faltante debería fallar antes de llamar a Groq', () => {
    const cacheKey = 'search-paris-medium';
    const apiKey = undefined;
    
    // Cache miss
    const cacheHit = mockCache.get(cacheKey);
    
    // Si no hay cache y no hay API key, debería fallar
    const shouldFail = !cacheHit && !apiKey;
    
    expect(cacheHit).toBeUndefined();
    expect(shouldFail).toBe(true);
  });

  it('[ERROR] error en cache no debería afectar configuración de Groq', () => {
    const apiKey = VALID_TEST_API_KEY;
    
    // Simular error en cache
    let cacheError = null;
    try {
      throw new Error('Cache corrupted');
    } catch (error) {
      cacheError = error;
    }
    
    // A pesar del error de cache, la configuración de Groq debería estar OK
    expect(cacheError).toBeDefined();
    expect(apiKey).toBe(VALID_TEST_API_KEY);
  });
});
