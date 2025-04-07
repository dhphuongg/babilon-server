export type SelectType<T> = {
  [key in keyof T]?: boolean;
};

export type PickSelected<
  T,
  S extends SelectType<T> | undefined,
> = S extends undefined
  ? T
  : {
      [key in keyof T as key extends keyof S
        ? S[key] extends true
          ? key
          : never
        : never]: T[key];
    };
