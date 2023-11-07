export type Id = string;

let nextId = 0;

export function generateId(entityType: string) {
  return `${entityType}-${(nextId++).toString()}`;
}
