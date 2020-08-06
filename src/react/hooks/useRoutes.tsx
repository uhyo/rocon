import React, { useContext, useMemo } from "react";
import { RoutePathResolver } from "../../builder/RoutePathResolver";
import { RouteContext } from "../contexts/RouteContext";
import { ReactElement } from "../types/ReactElement";
import type { ReactRouteBuilder } from "../types/ReactRouteBuilder";
import { useLocation } from "./useLocation";

/**
 * Receives a route builder and returns a corresponding rendered route.
 */
export const useRoutes = (builder: ReactRouteBuilder): ReactElement | null => {
  const parentRoute = useContext(RouteContext);

  const location = useLocation();
  const locationToResolve = parentRoute?.nextLocation ?? location;
  const resolver = useMemo(() => RoutePathResolver.getFromBuilder(builder), [
    builder,
  ]);
  const obj = useMemo(() => {
    const resolved = resolver.resolve(locationToResolve)[0];
    if (resolved === undefined) {
      return undefined;
    }
    const result = resolved.route.action(resolved.match as never);
    const routeContextValue = {
      route: resolved.route,
      routeLocation: resolved.currentLocation,
      nextLocation: resolved.location,
    };
    return {
      result,
      routeContextValue,
    };
  }, [resolver, location]);

  return obj ? (
    <RouteContext.Provider value={obj.routeContextValue}>
      {obj.result}
    </RouteContext.Provider>
  ) : null;
};
