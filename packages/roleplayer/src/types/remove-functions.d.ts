type NonFunctionKeyNames<T> = Exclude<
  {
    [key in keyof T]: T[key] extends Function ? never : key;
  }[keyof T],
  undefined
>;

export type OmitFunctions<T> = Pick<T, NonFunctionKeyNames<T>>;
