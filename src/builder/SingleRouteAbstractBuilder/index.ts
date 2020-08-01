import type { Location } from "../../LocationComposer/Location";
import type { RouteRecordType } from "../RouteRecord";
import type { AttachFunction } from "../RouteRecord/RouteRecordType";

export abstract class SingleRouteAbstractBuilder<
  ActionResult,
  Match,
  HasAction extends boolean
> {
  abstract getRoute(): RouteRecordType<ActionResult, Match, HasAction>;

  constructor() {
    Object.defineProperty(this, "attach", {
      configurable: true,
      value(
        this: SingleRouteAbstractBuilder<ActionResult, Match, HasAction>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        builder: any
      ) {
        return this.getRoute().attach(builder);
      },
    });
  }

  /**
   * Attach a given route builder to the current route.
   */
  readonly attach!: AttachFunction<ActionResult, Match>;
  // defined in the constructor

  /**
   * Get the location of this route.
   */
  getLocation(match: Match): Location {
    return this.getRoute().getLocation(match);
  }
}
