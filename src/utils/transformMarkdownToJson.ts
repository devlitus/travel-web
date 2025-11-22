export function transformMarkdownToJson(input: string): any {
  const originalInput = input;

  // Elimina bloques de código markdown (```json ... ```, ``` ... ```)
  input = input.replace(/```json\s*([\s\S]*?)\s*```/gi, '$1');
  input = input.replace(/```\s*([\s\S]*?)\s*```/gi, '$1');

  // Quita todo lo que esté antes del primer {
  const jsonStart = input.indexOf('{');
  if (jsonStart > 0) {
    input = input.substring(jsonStart);
  }

  // Quita todo lo que esté después del último }
  const jsonEnd = input.lastIndexOf('}');
  if (jsonEnd > 0 && jsonEnd < input.length - 1) {
    input = input.substring(0, jsonEnd + 1);
  }

  // Limpia espacios y saltos de línea
  input = input.trim();

  // Detectar JSON potencialmente truncado
  if (input.endsWith('"') && !input.endsWith('"}')) {
    const lastChars = input.slice(-50);
    throw new Error(
      `JSON parece estar truncado. Termina en: ...${lastChars}. Aumenta maxOutputTokens.`
    );
  }

  // Verificar que hay balance de llaves
  const openBraces = (input.match(/\{/g) || []).length;
  const closeBraces = (input.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    throw new Error(
      `JSON mal formado: ${openBraces} llaves abiertas vs ${closeBraces} cerradas. Posiblemente truncado.`
    );
  }

  try {
    return JSON.parse(input);
  } catch (error) {
    const parseError = error as Error;
    // Agregar más contexto al error de parseo
    throw new Error(
      `Error parseando JSON: ${parseError.message}. Longitud: ${input.length} caracteres.`
    );
  }
}
