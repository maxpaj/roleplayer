export type Id = string;

export function generateId(entityType: string) {
  return `${entityType}-${Date.now().toString()}`;
}
