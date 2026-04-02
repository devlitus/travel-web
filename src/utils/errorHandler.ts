/**
 * Manejador centralizado de errores para las rutas API
 * Proporciona respuestas consistentes y logging adecuado
 */

import { ZodError } from 'zod';
import {
  AppError,
  ValidationError,
  ConfigurationError,
  ExternalServiceError,
} from './errors';

/**
 * Maneja cualquier tipo de error y retorna una respuesta HTTP apropiada
 *
 * @param error - El error a manejar
 * @param context - Contexto adicional para logging (opcional)
 * @returns Response con el error formateado
 */
export function handleApiError(
  error: unknown,
  context?: { endpoint?: string; params?: any }
): Response {
  // Log del contexto si existe
  if (context) {
    console.error('Error en API:', {
      endpoint: context.endpoint,
      params: context.params,
      timestamp: new Date().toISOString(),
    });
  }

  // Error de validación Zod
  if (error instanceof ZodError) {
    const issues = (error as any).errors || (error as any).issues || [];
    const validationError = new ValidationError(
      'Los datos de entrada no son válidos',
      {
        errors: issues.map((err: any) => ({
          path: err.path?.join('.') || '',
          message: err.message,
          code: err.code,
        })),
      }
    );
    console.error('Error de validación:', validationError.toJSON());
    return errorResponse(validationError);
  }

  // Errores de aplicación personalizados
  if (error instanceof AppError) {
    console.error(`${error.constructor.name}:`, error.toJSON());
    return errorResponse(error);
  }

  // Error estándar de JavaScript
  if (error instanceof Error) {
    console.error('Error no tipado:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    const genericError = new AppError(
      'INTERNAL_ERROR',
      error.message || 'Error interno del servidor',
      500
    );
    return errorResponse(genericError);
  }

  // Error completamente desconocido
  console.error('Error desconocido:', error);
  const unknownError = new AppError(
    'UNKNOWN_ERROR',
    'Ha ocurrido un error inesperado',
    500
  );
  return errorResponse(unknownError);
}

/**
 * Crea una respuesta HTTP de error formateada
 *
 * @param error - El error de aplicación
 * @returns Response con el JSON del error
 */
function errorResponse(error: AppError): Response {
  return new Response(JSON.stringify(error.toJSON()), {
    status: error.statusCode,
    headers: {
      'Content-Type': 'application/json',
      'X-Error-Code': error.code,
    },
  });
}

/**
 * Valida que las claves de API requeridas estén presentes
 *
 * @param keys - Objeto con las claves a validar { name: value }
 * @throws ConfigurationError si alguna clave falta
 */
export function validateApiKeys(keys: Record<string, string | undefined>): void {
  const missingKeys = Object.entries(keys)
    .filter(([_, value]) => !value)
    .map(([name]) => name);

  if (missingKeys.length > 0) {
    throw new ConfigurationError(
      `Faltan claves de API requeridas: ${missingKeys.join(', ')}`
    );
  }
}

/**
 * Wrapper para manejo seguro de servicios externos
 *
 * @param serviceName - Nombre del servicio externo
 * @param fn - Función async a ejecutar
 * @returns El resultado de la función o lanza ExternalServiceError
 */
export async function handleExternalService<T>(
  serviceName: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Error desconocido';
    throw new ExternalServiceError(serviceName, message);
  }
}
