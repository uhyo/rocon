/**
 * Type of function which checks whether given value is of type R.
 */
export type Validator<R> = (value: unknown) => value is R;

export const isString: Validator<string> = (value): value is string =>
  typeof value === "string";

export const isNumber: Validator<number> = (value): value is number =>
  typeof value === "number";
