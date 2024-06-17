export function isString(o: unknown): o is string {
  return typeof o === 'string';
}

export const isArray = Array.isArray;
