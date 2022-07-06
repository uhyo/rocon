import { State } from "history";
import type { Location } from "../../core/Location";
/**
 * Check whether `location` is based on `base`.
 * @returns Remaining part of `location` if based, undefined otherwise.
 */
export function locationDiff<
  BaseState extends State,
  LocationState extends State
>(
  base: Location<BaseState>,
  location: Location<LocationState>
): Location<Omit<LocationState, keyof BaseState>> | undefined {
  const basePathSegments = base.pathname.split("/").filter((v) => v !== "");
  const locationPathSegments = location.pathname
    .split("/")
    .filter((v) => v !== "");
  // Path is not suffix
  if (!isSuffix(basePathSegments, locationPathSegments)) {
    return undefined;
  }
  const remainingPath =
    "/" + locationPathSegments.slice(basePathSegments.length).join("/");

  const baseSearch = new URLSearchParams(base.search);
  const locationSearch = new URLSearchParams(location.search);

  for (const [key, value] of baseSearch.entries()) {
    if (locationSearch.get(key) !== value) {
      // has different value
      return undefined;
    }
    locationSearch.delete(key);
  }

  const result = {
    ...location,
    pathname: remainingPath,
  };

  const search = locationSearch.toString();

  if (search !== "") {
    result.search = "?" + search;
  } else if (result.search !== undefined) {
    result.search = "";
  }

  const diffState: Record<string, unknown> = {};
  const baseState = (base.state ?? {}) as Record<string, unknown>;
  for (const [key, value] of Object.entries(
    (location.state ?? {}) as Record<string, unknown>
  )) {
    if (baseState[key] !== undefined) {
      if (baseState[key] !== value) {
        return undefined;
      }
      continue;
    }
    diffState[key] = value;
  }
  if (location.state !== null) {
    result.state = diffState as LocationState;
  }

  return result;
}

function isSuffix(arr1: readonly string[], arr2: readonly string[]) {
  return arr1.every((v, i) => v === arr2[i]);
}
