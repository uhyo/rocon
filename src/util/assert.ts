/**
 * Asserts given value is a string.
 */
export function assertString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`Invariant failure: ${value} is not a string`);
  }
}
