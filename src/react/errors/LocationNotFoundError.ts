/**
 * Error that current location could not be resolved.
 */
export class LocationNotFoundError extends Error {}

/**
 * Returns whether given object is a LocationNotFoundError object.
 */
export function isLocationNotFoundError(
  obj: unknown
): obj is LocationNotFoundError {
  return obj instanceof LocationNotFoundError;
}
