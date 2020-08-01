import { BuilderLink } from "../../core/BuilderLink";
import { Location } from "../../LocationComposer/Location";

const defaultRoot: Location = {
  pathname: "/",
  state: null,
};

export function resolveLinkLocation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  link: BuilderLink<any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  match: any
): Location {
  const parentRoute = link.getParentRoute();
  return parentRoute?.getLocation(match as never) ?? defaultRoot;
}
