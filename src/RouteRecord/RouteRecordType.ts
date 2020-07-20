import type { Location } from "../LocationComposer/Location";
import type { AttachableRoutesBuilder } from "../RoutesBuilder/AttachableRoutesBuilder";
import type { RouteDefinition } from "../RoutesBuilder/RoutesDefinitionObject";

/**
 * Route object internally stored in RoutesBuilder.
 */
export type RouteRecordType<ActionResult, Match> = RouteDefinition<
  Match,
  ActionResult
> & {
  readonly getLocation: (match: Match) => Location;
  readonly getBuilder: () =>
    | AttachableRoutesBuilder<
        ActionResult,
        Record<string, RouteDefinition<Match, ActionResult>>,
        Match
      >
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly attach: <
    B extends AttachableRoutesBuilder<ActionResult, any, Match>
  >(
    builder: B
  ) => B;
};
