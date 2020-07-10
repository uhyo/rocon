export type RouteDefinition<State, Result> = {
  readonly action: (state?: State) => Result;
};

export type RoutesDefinition<Result> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteDefinition<any, Result>
>;
