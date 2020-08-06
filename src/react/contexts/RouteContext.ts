import { createContext } from "react";
import { Location } from "../../core/Location";
import { ReactRouteRecord } from "../types/ReactElement";

type RouteContextValue = {
  route: ReactRouteRecord<never>;
  nextLocation: Location;
};

/**
 * Context in which current route is provided.
 */
export const RouteContext = createContext<RouteContextValue | undefined>(
  undefined
);
