export type Id = string;

export function generateId() {
  return (crypto || import("node:crypto")).randomUUID();
}
