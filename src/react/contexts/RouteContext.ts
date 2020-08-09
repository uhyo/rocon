import { createContext } from "react";
import { BuilderLink } from "../../core/BuilderLink";
import { Location } from "../../core/Location";
import { ReactElement, ReactRouteRecord } from "../types/ReactElement";

export type RouteContextValue = {
  /**
   * Route rendered by the parent useRoutes().
   */
  route: ReactRouteRecord<never>;
  /**
   * All topmost links and associated locations in ancestor useRoutes() calls.
   */
  ancestorRoutes: Array<{
    link: BuilderLink<ReactElement | null, unknown, ReactRouteRecord<never>>;
    location: Location;
  }>;
  /**
   * Location rendered by the parent useRoutes().
   */
  routeLocation: Location;
  /**
   * Location that are not resolved by the parent useRoutes().
   */
  nextLocation: Location;
};

/**
 * Context in which current route is provided.
 */
export const RouteContext = createContext<RouteContextValue | undefined>(
  undefined
);
