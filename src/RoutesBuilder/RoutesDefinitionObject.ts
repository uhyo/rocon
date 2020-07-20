/* eslint-disable @typescript-eslint/no-explicit-any */
export type RouteDefinition<ActionResult, Match> = {
  readonly action: (match: Match) => ActionResult;
};

export type ActionType<ActionResult, Match> = RouteDefinition<
  ActionResult,
  Match
>["action"];

/**
 * Get Match type of given RouteDefinition.
 */
export type MatchOfRouteDefinition<RD> = RD extends RouteDefinition<
  any,
  infer Match
>
  ? unknown extends Match
    ? {}
    : Match
  : {};

export type RoutesDefinition<ActionResult> = Record<
  string,
  RouteDefinition<ActionResult, any>
>;
