import { HasBuilderLink } from "../../BuilderLink/AttachableRouteBuilder";
import { Location } from "../../LocationComposer/Location";
import { resolveLinkLocation } from "./resolveLinkLocation";
import { ActionTypeOfRouteRecord, RouteRecordBase } from "./RouteRecordBase";
import { RouteRecordType } from "./RouteRecordType";

/**
 * Object for non-progress route record.
 */
export class IdentityRouteRecord<ActionResult, Match, HasAction extends boolean>
  extends RouteRecordBase<ActionResult, Match, HasAction>
  implements RouteRecordType<ActionResult, Match, HasAction> {
  #parent: HasBuilderLink<ActionResult, unknown>;

  constructor(
    parent: HasBuilderLink<ActionResult, unknown>,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(parent.getBuilderLink(), action);
    this.#parent = parent;
  }

  getLocation(match: Match): Location {
    const link = this.#parent.getBuilderLink();
    return resolveLinkLocation(link, match, (loc) => loc);
  }
}
