import { Location } from "../../core/Location";
import { routeRecordParentKey, routeRecordSegmentGetterKey } from "../symbols";
import { RouteRecordBase } from "./RouteRecordBase";

const defaultRoot: Location = {
  pathname: "/",
  state: null,
};

export function getRouteRecordLocation<Match>(
  routeRecord: RouteRecordBase<unknown, Match, boolean>,
  match: Match,
  root: Location = defaultRoot
): Location {
  const parentLocation = routeRecord[routeRecordParentKey].composeFromTop(
    root,
    match
  );
  return routeRecord[routeRecordParentKey].composer.compose(
    parentLocation,
    routeRecord[routeRecordSegmentGetterKey](match)
  );
}
