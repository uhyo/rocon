import { AttachableRouteBuilder } from "../RouteBuilderLink";
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
    super(parent.getBuilderLink(), action, () => key);
    this.#parent = parent;
    this.key = key;
  }
}
