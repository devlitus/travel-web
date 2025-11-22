import { searchCache, hashString } from "../../utils/clientCache";

export interface SearchResult {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    description?: string;
    statusCode: number;
  };
}

export class SearchHandler {
  checkCache(formData: any): any | null {
    const searchKey = hashString(JSON.stringify(formData));
    return searchCache.get(`search-${searchKey}`);
  }

  saveToCache(formData: any, result: any): void {
    const searchKey = hashString(JSON.stringify(formData));
    searchCache.set(`search-${searchKey}`, result, 30 * 60 * 1000);
  }

  async submitSearch(formData: any): Promise<SearchResult> {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        this.saveToCache(formData, result);
        return { success: true, data: result };
      }

      // Error HTTP - intentar parsear el error de la API
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      return {
        success: false,
        error: {
          code: errorData.code || 'API_ERROR',
          message: this.getErrorMessage(errorData, response.status),
          description: this.getErrorDescription(errorData, response.status),
          statusCode: response.status,
        },
      };
    } catch (error) {
      // Error de red o timeout
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch');

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: isNetworkError
            ? 'Error de conexión'
            : 'Error inesperado',
          description: isNetworkError
            ? 'Verifica tu conexión a internet e intenta de nuevo'
            : error instanceof Error ? error.message : 'Ha ocurrido un error desconocido',
          statusCode: 0,
        },
      };
    }
  }

  private getErrorMessage(errorData: any, statusCode: number): string {
    if (errorData.message) {
      return errorData.message;
    }

    // Mensajes por código de estado
    const statusMessages: Record<number, string> = {
      400: 'Datos de entrada inválidos',
      401: 'No autorizado',
      403: 'Acceso denegado',
      404: 'Recurso no encontrado',
      500: 'Error del servidor',
      502: 'Servicio no disponible',
      503: 'Servicio temporalmente no disponible',
    };

    return statusMessages[statusCode] || 'Error en la búsqueda';
  }

  private getErrorDescription(errorData: any, statusCode: number): string {
    // Si hay detalles en el error, intentar extraer información útil
    if (errorData.details) {
      if (typeof errorData.details === 'string') {
        return errorData.details;
      }
      if (errorData.details.errors && Array.isArray(errorData.details.errors)) {
        return errorData.details.errors.map((e: any) => e.message).join(', ');
      }
    }

    // Descripciones por código de estado
    const descriptions: Record<number, string> = {
      400: 'Por favor verifica que todos los campos estén completados correctamente',
      500: 'Estamos experimentando problemas técnicos. Intenta de nuevo en unos momentos',
      502: 'El servicio de IA no está disponible en este momento',
      503: 'El servidor está ocupado. Por favor intenta de nuevo',
    };

    return descriptions[statusCode] || '';
  }

  buildRedirectUrl(destination: string, formData: any, activities: string[]): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(formData)) {
      if (value && key !== "destination") {
        params.append(key, value as string);
      }
    }

    activities.forEach((activity) => {
      if (activity) {
        params.append("activities", activity);
      }
    });

    return `/itinerary/${encodeURIComponent(destination)}?${params.toString()}`;
  }
}
