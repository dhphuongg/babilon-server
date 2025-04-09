export type SelectType<T> = {
  [key in keyof T]?: boolean;
};

type IsAllFalse<S> = keyof {
  [K in keyof S as S[K] extends true ? K : never]: true;
} extends never
  ? true
  : false;

export type PickSelected<
  T,
  S extends SelectType<T> | undefined,
> = S extends undefined
  ? T
  : IsAllFalse<S> extends true
    ? T
    : {
        [K in keyof T as K extends keyof S
          ? S[K] extends true
            ? K
            : never
          : never]: T[K];
      };
