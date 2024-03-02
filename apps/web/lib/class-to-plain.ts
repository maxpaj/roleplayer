import { RemoveFunctions } from "types/without-functions";

export function classToPlain<T>(o: T): RemoveFunctions<T> {
  const stringified = JSON.stringify(o);
  const parsed = JSON.parse(stringified);
  return parsed;
}
