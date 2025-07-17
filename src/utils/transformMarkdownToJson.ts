export function transformMarkdownToJson(input: string): any {
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

  // Log para depuración (puedes quitarlo luego)
  // console.log('Intentando parsear JSON:', input);

  return JSON.parse(input);
}
