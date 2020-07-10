export type RouteDefinitionWithoutState<Result> = {
  readonly action: () => Result;
};

export type RouteDefinitionWithState<State, Result> = {
  readonly action: (state: State) => Result;
};

export type RouteDefinition<State, Result> =
  | RouteDefinitionWithoutState<Result>
  | RouteDefinitionWithState<State, Result>;

export type RoutesDefinition<Result> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteDefinition<any, Result>
>;
