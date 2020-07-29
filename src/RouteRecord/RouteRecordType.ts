import type { Location } from "../LocationComposer/Location";
import type { AttachableRoutesBuilder } from "../RoutesBuilder/AttachableRoutesBuilder";
import { ActionTypeOfRouteRecord } from "./RouteRecordBase";

/**
 * Route object internally stored in RoutesBuilder.
 */
export type RouteRecordType<ActionResult, Match, HasAction extends boolean> = {
  readonly action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>;
  readonly getLocation: (match: Match) => Location;
  readonly getAttachedBuilder: () =>
    | AttachableRoutesBuilder<ActionResult, string>
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly attach: <B extends AttachableRoutesBuilder<ActionResult, any>>(
    builder: B
  ) => B;
};
