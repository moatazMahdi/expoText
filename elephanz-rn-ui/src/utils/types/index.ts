export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

export type NonMethodKeys<T> = (
  {
    [P in keyof T]: T[P] extends Function
      ? never
      : P
  }
  & {
    [x: string]: never
  }
)[keyof T];

export type RemoveMethods<T> = Pick<T, NonMethodKeys<T>>;

export type RecursivePartialNonMethod<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<RemoveMethods<U>>[] :
    T[P] extends object ? RecursivePartial<RemoveMethods<T[P]>> :
      T[P];
};
