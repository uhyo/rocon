import type { RouteDefinitionWithoutState, RouteDefinitionWithState, RoutesDefinition } from "../RoutesBuilder/RoutesDefinitionObject"
import type { Destination } from "./Destination"

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RouteObject<State> = {
  go: (...args: State extends undefined ? [] :
    undefined extends State ?
    [state?: State] : [state: State]
  ) => void
}

export type DefinitionFromRouteObjects<Defs extends RoutesDefinition<Destination<unknown>>> = {
  [P in keyof Defs]: Defs[P] extends RouteDefinitionWithoutState<any>
    ? RouteObject<undefined>
    : Defs[P] extends RouteDefinitionWithState<infer State, any> 
    ? RouteObject<State>
    : undefined
}