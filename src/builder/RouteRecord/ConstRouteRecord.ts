import type { HasBuilderLink } from "../../core/BuilderLink/AttachableRouteBuilder";
import type { Location } from "../../core/Location";
import { ActionTypeOfRouteRecord, RouteRecordBase } from "./RouteRecordBase";
import type { RouteRecordType } from "./RouteRecordType";

/**
 * Object for fixed-location route record.
 */
export class ConstRouteRecord<ActionResult, Match, HasAction extends boolean>
  extends RouteRecordBase<ActionResult, Match, HasAction>
  implements RouteRecordType<ActionResult, Match, HasAction> {
  readonly location: Location;

  constructor(
    parent: HasBuilderLink<ActionResult, unknown>,
    location: Location,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(parent.getBuilderLink(), action);
    this.location = location;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLocation(_match: unknown): Location {
    return this.location;
  }
}
