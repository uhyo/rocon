import type { RouteDefinition, RoutesDefinition } from "../builder/RoutesDefinitionObject"
import type { Destination } from "./Destination"

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RouteObject<Match> = {
  go: (...args: {} extends Match ? [] :
    Match extends {} ?
    [state?: Match] : [state: Match]
  ) => void
}

export type DefinitionFromRouteObjects<Defs extends RoutesDefinition<Destination<unknown>>> = {
  [P in keyof Defs]:  Defs[P] extends RouteDefinition<any, infer Match> 
    ? RouteObject<Match>
    : undefined
}