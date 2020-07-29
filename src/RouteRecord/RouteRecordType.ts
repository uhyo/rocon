import type { Location } from "../LocationComposer/Location";
import type { AttachableRoutesBuilder } from "../RoutesBuilder/AttachableRoutesBuilder";
import { ActionTypeOfRouteRecord } from "./RouteRecordBase";

/**
 * Route object internally stored in RoutesBuilder.
 */
export type RouteRecordType<ActionResult, Match, HasAction extends boolean> = {
  readonly action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>;
  readonly getLocation: (match: Match) => Location;
  readonly getBuilder: () => AttachableRoutesBuilder<ActionResult> | undefined;
  readonly attach: <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    B extends AttachableRoutesBuilder<ActionResult>
  >(
    builder: B
  ) => B;
};
