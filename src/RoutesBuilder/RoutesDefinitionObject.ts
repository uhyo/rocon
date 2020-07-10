export type RouteDefinition<State, Result> = {
  readonly action: (...args: [] | [state: State]) => Result;
};

export type RoutesDefinition<Result> = Readonly<Record<
  string,
  RouteDefinition<never, Result>
>>;
