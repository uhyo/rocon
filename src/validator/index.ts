/**
 * Type of function which checks whether given value is of type R.
 */
export type Validator<R> = (value: unknown) => value is R;

export const isString: Validator<string> = (value): value is string =>
  typeof value === "string";

export const isStringOrUndefined: Validator<string | undefined> = (
  value
): value is string | undefined =>
  typeof value === "string" || value === undefined;

export const isNumber: Validator<number> = (value): value is number =>
  typeof value === "number";

/**
 * Convert a given validator to another validator that also accepts undefined.
 */
export const isUndefinedOr = <R>(
  validator: Validator<R>
): Validator<R | undefined> => (value): value is R | undefined =>
  value === undefined || validator(value);
