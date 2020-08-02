import type { Location } from "../../core/Location";
import { AttachableRouteBuilder } from "../RouteBuilderLink";
import { resolveLinkLocation } from "./resolveLinkLocation";
import { ActionTypeOfRouteRecord, RouteRecordBase } from "./RouteRecordBase";
import type { RouteRecordType } from "./RouteRecordType";

/**
 * Object for each route provided by PathRouteBuilder.
 */
export class PathRouteRecord<ActionResult, Match, HasAction extends boolean>
  extends RouteRecordBase<ActionResult, Match, HasAction>
  implements RouteRecordType<ActionResult, Match, HasAction> {
  /**
   * Key of this route.
   */
  readonly key: string;
  #parent: AttachableRouteBuilder<ActionResult, string>;

  constructor(
    parent: AttachableRouteBuilder<ActionResult, string>,
    key: string,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(parent.getBuilderLink(), action);
    this.#parent = parent;
    this.key = key;
  }

  getLocation(match: Match): Location {
    const link = this.#parent.getBuilderLink();
    const parentLocation = resolveLinkLocation(link, match);
    return link.composer.compose(parentLocation, this.key);
  }
}
