import type { HasBuilderLink } from "../../BuilderLink/AttachableRoutesBuilder";
import type { Location } from "../../LocationComposer/Location";
import { resolveLinkLocation } from "./resolveLinkLocation";
import { ActionTypeOfRouteRecord, RouteRecordBase } from "./RouteRecordBase";
import type { RouteRecordType } from "./RouteRecordType";

/**
 * Object for each route provided by PathRoutesBuilder.
 */
export class PathRouteRecord<ActionResult, Match, HasAction extends boolean>
  extends RouteRecordBase<ActionResult, Match, HasAction>
  implements RouteRecordType<ActionResult, Match, HasAction> {
  /**
   * Key of this route.
   */
  readonly key: string;
  #parent: HasBuilderLink<ActionResult, string>;

  constructor(
    parent: HasBuilderLink<ActionResult, string>,
    key: string,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(action);
    this.#parent = parent;
    this.key = key;
  }

  getLocation(match: Match): Location {
    const link = this.#parent.getBuilderLink();
    return resolveLinkLocation(link, match, (parentLocation) =>
      link.composer.compose(parentLocation, this.key)
    );
  }
}
