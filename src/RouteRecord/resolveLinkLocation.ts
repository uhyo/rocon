import { BuilderLink } from "../BuilderLink";
import { Location } from "../LocationComposer/Location";

export function resolveLinkLocation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  link: BuilderLink<any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  match: any,
  composeLast: (location: Location) => Location
): Location {
  const parentRoute = link.getParentRoute();
  const parentLocation =
    parentRoute?.getLocation(match as never) ?? link.getRootLocation();
  return composeLast(parentLocation);
}
