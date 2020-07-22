import type { Location } from "../LocationComposer/Location";
import type { AttachableRoutesBuilder } from "../RoutesBuilder/AttachableRoutesBuilder";
import type { RouteDefinition } from "../RoutesBuilder/RoutesDefinitionObject";
import { ActionTypeOfRouteRecord } from "./RouteRecordBase";

/**
 * Route object internally stored in RoutesBuilder.
 */
export type RouteRecordType<ActionResult, Match, HasAction extends boolean> = {
  readonly action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>;
  readonly getLocation: (match: Match) => Location;
  readonly getBuilder: () =>
    | AttachableRoutesBuilder<
        ActionResult,
        Record<string, RouteDefinition<ActionResult, Match>>,
        boolean,
        Match
      >
    | undefined;
  readonly attach: <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    B extends AttachableRoutesBuilder<ActionResult, any, any, Match>
  >(
    builder: B
  ) => B;
};
