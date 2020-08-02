import type { HasBuilderLink } from "../../core/BuilderLink/AttachableRouteBuilder";
import { Location } from "../../core/Location";
import { RouteBuilderLink, RouteBuilderLinkValue } from "../RouteBuilderLink";
import type { ActionType } from "../RoutesDefinitionObject";
import { routeRecordParentKey } from "../symbols";
import { AttachFunction, RouteRecordType } from "./RouteRecordType";

export type ActionTypeOfRouteRecord<
  ActionResult,
  Match,
  HasAction extends boolean
> = HasAction extends true ? ActionType<ActionResult, Match> : undefined;

/**
 * Object for each route provided by RouteBuilder.
 * Should implement RouteRecordType.
 */
export abstract class RouteRecordBase<
  ActionResult,
  Match,
  HasAction extends boolean
> implements RouteRecordType<ActionResult, Match, HasAction> {
  /**
   * Action of this route.
   */
  readonly action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>;
  readonly [routeRecordParentKey]: RouteBuilderLink<ActionResult, unknown>;

  #builder?: RouteBuilderLink<ActionResult, unknown> = undefined;

  constructor(
    parentLink: RouteBuilderLink<ActionResult, unknown>,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    this.action = action;
    Object.defineProperty(this, routeRecordParentKey, {
      value: parentLink,
    });

    Object.defineProperty(this, "attach", {
      configurable: true,
      writable: true,
      value(
        this: RouteRecordBase<ActionResult, Match, HasAction>,
        builder: HasBuilderLink<
          ActionResult,
          unknown,
          RouteBuilderLinkValue<ActionResult>
        >
      ) {
        const link = builder.getBuilderLink();
        this.#builder = link;
        link.attachToParent(this, parentLink);
        return builder;
      },
    });
  }

  abstract getLocation(match: Match): Location;

  /**
   * Get the link attached to this Route.
   */
  getAttachedBuilderLink():
    | RouteBuilderLink<ActionResult, unknown>
    | undefined {
    return this.#builder;
  }

  /**
   * Attach given builder as a child of this route.
   */
  readonly attach!: AttachFunction<ActionResult, Match>;
}
