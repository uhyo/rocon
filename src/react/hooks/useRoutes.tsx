import React, { useContext, useMemo } from "react";
import { RoutePathResolver } from "../../builder/RoutePathResolver";
import { RouteContext } from "../contexts/RouteContext";
import { LocationNotFoundError } from "../errors/LocationNotFoundError";
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
  const resolver = useMemo(
    () => RoutePathResolver.getFromBuilder(builder),
    [builder]
  );
  const { routeContextValue, result } = useMemo(() => {
    const resolved = resolver.resolve(locationToResolve)[0];
    if (resolved === undefined) {
      throw new LocationNotFoundError(
        "Current location could not be resolved."
      );
    }

    const ancestorRoutes = parentRoute
      ? parentRoute.ancestorRoutes.concat()
      : [];
    ancestorRoutes.push({
      link: builder.getBuilderLink().getAttachmentRoot(),
      location: parentRoute?.routeLocation || {
        pathname: "/",
        state: null,
      },
    });

    // const result = resolved.route.action(resolved.match as never);
    const result = React.createElement(
      resolved.route.action,
      resolved.match as never
    ) as unknown as React.ReactNode;
    const routeContextValue = {
      route: resolved.route,
      ancestorRoutes,
      routeLocation: resolved.currentLocation,
      nextLocation: resolved.remainingLocation,
    };
    return {
      result,
      routeContextValue,
    };
  }, [parentRoute, resolver, locationToResolve]);

  return (
    <RouteContext.Provider value={routeContextValue}>
      {result}
    </RouteContext.Provider>
  );
};
