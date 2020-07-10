export type RouteDefinitionWithoutState<ActionResult> = {
  readonly action: () => ActionResult;
};

export type RouteDefinitionWithState<State, ActionResult> = {
  readonly action: (state: State) => ActionResult;
};

export type RouteDefinition<State, ActionResult> =
  | RouteDefinitionWithoutState<ActionResult>
  | RouteDefinitionWithState<State, ActionResult>;

export type RoutesDefinition<ActionResult> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteDefinition<any, ActionResult>
>;
