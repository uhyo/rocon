/* eslint-disable @typescript-eslint/no-explicit-any */
export type RouteDefinitionWithoutState<ActionResult> = {
  readonly action: () => ActionResult;
};

export type RouteDefinitionWithState<State, ActionResult> = {
  readonly action: (state: State) => ActionResult;
};

export type RouteDefinition<State, ActionResult> =
  | RouteDefinitionWithoutState<ActionResult>
  | RouteDefinitionWithState<State, ActionResult>;

/**
 * Return correct RouteDefinition type.
 * undefined is treated as no state.
 */
export type RouteDefinitionByState<
  State,
  ActionResult
> = State extends undefined
  ? RouteDefinitionWithoutState<ActionResult>
  : RouteDefinitionWithState<State, ActionResult>;

/**
 * Get State of given RouteDefinition.
 * Returns undefined for no State.
 */
export type StateOfRouteDefinition<RD> = RD extends RouteDefinitionWithoutState<
  any
>
  ? undefined
  : RD extends RouteDefinitionWithState<infer S, any>
  ? S
  : undefined;

export type RoutesDefinition<ActionResult> = Record<
  string,
  RouteDefinition<any, ActionResult>
>;
