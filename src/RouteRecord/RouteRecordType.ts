import type { Location } from "../LocationComposer/Location";
import type { AttachableRoutesBuilder } from "../RoutesBuilder/AttachableRoutesBuilder";
import { ActionTypeOfRouteRecord } from "./RouteRecordBase";

/**
 * Route object internally stored in RoutesBuilder.
 */
export type RouteRecordType<ActionResult, Match, HasAction extends boolean> = {
  readonly action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>;
  readonly getLocation: (match: Match) => Location;
  readonly getBuilder: () =>
    | AttachableRoutesBuilder<ActionResult, string>
    | undefined;
  readonly attach: <B extends AttachableRoutesBuilder<ActionResult, string>>(
    builder: B
  ) => B;
};
