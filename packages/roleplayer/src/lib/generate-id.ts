import { v4 as uuidv4 } from 'uuid';
export type Id = ReturnType<typeof uuidv4>
export function dangerousGenerateId(): Id {
  return uuidv4()
}
