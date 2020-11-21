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
  readonly key: string | undefined;

  constructor(
    parent: AttachableRouteBuilder<ActionResult, string | undefined>,
    key: string | undefined,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(parent.getBuilderLink(), action, () => key);
    this.key = key;
  }
}
