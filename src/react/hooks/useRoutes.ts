import { useMemo } from "react";
import { RoutePathResolver } from "../../builder/RoutePathResolver";
import { ReactElement } from "../types/ReactElement";
import type { ReactRouteBuilder } from "../types/ReactRouteBuilder";
import { useLocation } from "./useLocation";

/**
 * Receives a route builder and returns a corresponding rendered route.
 */
export const useRoutes = (builder: ReactRouteBuilder): ReactElement | null => {
  const location = useLocation();
  const resolver = useMemo(() => RoutePathResolver.getFromBuilder(builder), [
    builder,
  ]);
  const resolved = useMemo(() => resolver.resolveAction(location), [
    resolver,
    location,
  ]);
  return resolved || null;
};
