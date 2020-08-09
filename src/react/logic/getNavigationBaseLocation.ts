import { routeRecordParentKey } from "../../builder/symbols";
import { Location } from "../../core/Location";
import { RouteContextValue } from "../contexts/RouteContext";
import { ReactRouteRecord } from "../types/ReactElement";

export const getNavigationBaseLocation = (
  parentRoute: RouteContextValue | undefined,
  route: ReactRouteRecord<never>
): Location | undefined => {
  const ancenstorRoutes = parentRoute?.ancestorRoutes;
  const routeTopmostBuilderLink = route[
    routeRecordParentKey
  ].getAttachmentRoot();
  return (
    ancenstorRoutes?.find(({ link }) => link === routeTopmostBuilderLink)
      ?.location || parentRoute?.routeLocation
  );
};
