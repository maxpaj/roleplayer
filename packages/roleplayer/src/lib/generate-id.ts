import { v4 as uuidv4 } from "uuid";
export type Id = ReturnType<typeof uuidv4>;

export function generateId(): Id {
  return uuidv4();
}
