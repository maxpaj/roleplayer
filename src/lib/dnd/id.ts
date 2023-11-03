export type Id = string;

export function generateId() {
  return Date.now().toString();
}
