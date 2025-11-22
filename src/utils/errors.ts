/**
 * Sistema de errores personalizados para la aplicación
 * Permite manejo tipado y estructurado de errores
 */

/**
 * Clase base para todos los errores de la aplicación
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Serializa el error a formato JSON para respuestas API
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.details && { details: this.details }),
    };
  }
}

/**
 * Error de validación de datos de entrada
 * Usado cuando los datos del usuario no cumplen los requisitos
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

/**
 * Error de API interno
 * Usado para errores generales de la API
 */
export class ApiError extends AppError {
  constructor(message: string, statusCode: number = 500, details?: any) {
    super('API_ERROR', message, statusCode, details);
  }
}

/**
 * Error de servicio externo (Gemini, Unsplash, etc.)
 * Usado cuando falla la comunicación con APIs externas
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, statusCode: number = 502) {
    super('EXTERNAL_SERVICE_ERROR', `${service}: ${message}`, statusCode);
  }
}

/**
 * Error de cache
 * Usado cuando falla localStorage o cache en memoria
 */
export class CacheError extends AppError {
  constructor(message: string, details?: any) {
    super('CACHE_ERROR', message, 500, details);
  }
}

/**
 * Error de parseo de datos
 * Usado cuando falla el parseo de JSON o transformación de datos
 */
export class ParseError extends AppError {
  constructor(message: string, rawData?: string) {
    super('PARSE_ERROR', message, 500, { rawData });
  }
}

/**
 * Error de configuración
 * Usado cuando falta configuración necesaria (API keys, etc.)
 */
export class ConfigurationError extends AppError {
  constructor(message: string) {
    super('CONFIGURATION_ERROR', message, 500);
  }
}

/**
 * Error de respuesta vacía o inválida
 * Usado cuando la respuesta de un servicio no tiene el formato esperado
 */
export class InvalidResponseError extends AppError {
  constructor(service: string, message: string = 'Respuesta inválida o vacía') {
    super('INVALID_RESPONSE_ERROR', `${service}: ${message}`, 500);
  }
}
