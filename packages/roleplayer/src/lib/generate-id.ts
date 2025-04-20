import { v7 as uuidv7 } from "uuid";
export type Id = string;

export function generateId(): Id {
  return uuidv7();
}
