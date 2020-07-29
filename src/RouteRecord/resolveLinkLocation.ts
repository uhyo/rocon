import { Location } from "../LocationComposer/Location";
import { BuilderLink } from "../RoutesBuilder";

export function resolveLinkLocation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  link: BuilderLink<any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  match: any,
  composeLast: (location: Location) => Location
): Location {
  const parentRoute = link.getParentRoute();
  console.log({ link, parentRoute });
  const parentLocation =
    parentRoute?.getLocation(match as never) ?? link.getRootLocation();
  return composeLast(parentLocation);
}
