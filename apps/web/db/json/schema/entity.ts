import { randomUUID } from "node:crypto";

export type JSONEntityRecord<T> = {
  id: JSONEntityId;
  entity: T;
};

export type JSONEntityId = string;

export function generateEntityId() {
  return randomUUID();
}
