import { v4 } from "uuid";

export type Id = string;

export function generateId() {
  return v4();
}
