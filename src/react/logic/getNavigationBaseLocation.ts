import { routeRecordParentKey } from "../../builder/symbols";
import { Location } from "../../core/Location";
import { RouteContextValue } from "../contexts/RouteContext";
import { ReactRouteRecord } from "../types/ReactElement";

export const getNavigationBaseLocation = (
  parentRoute: RouteContextValue | undefined,
  route: ReactRouteRecord<never>
): Location | undefined => {
  const ancestorRoutes = parentRoute?.ancestorRoutes;
  const routeTopmostBuilderLink = route[
    routeRecordParentKey
  ].getAttachmentRoot();
  const record = ancestorRoutes?.find(
    ({ link }) => link === routeTopmostBuilderLink
  );
  return record?.location || parentRoute?.routeLocation;
};
