type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Date
    ? T
    : {
        [K in keyof T]: T[K] extends (infer U)[] ? RecursivelyReplaceNullWithUndefined<U>[] : RecursivelyReplaceNullWithUndefined<T[K]>;
      };

/**
 * Takes an object and maps any nulls to undefined, recursivelly
 * @param obj
 * @returns
 */
export function nullsToUndefined<T>(obj: T): RecursivelyReplaceNullWithUndefined<T> {
  if (!obj) {
    return undefined as any;
  }

  if (obj.constructor.name === "Object") {
    for (let key in obj) {
      obj[key] = nullsToUndefined(obj[key]) as any;
    }
  }

  return obj as RecursivelyReplaceNullWithUndefined<T>;
}
