import { createContext } from "react";

type RouteContextValue = {};

/**
 * Context in which current route is provided.
 */
export const RouteContext = createContext<RouteContextValue | undefined>(
  undefined
);
