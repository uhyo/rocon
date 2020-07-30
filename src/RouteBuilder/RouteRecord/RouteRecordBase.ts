import type { HasBuilderLink } from "../../BuilderLink/AttachableRouteBuilder";
import { Location } from "../../LocationComposer/Location";
import type { ActionType } from "../RoutesDefinitionObject";

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
> {
  /**
   * Action of this route.
   */
  readonly action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>;
  #builder?: HasBuilderLink<ActionResult, string> = undefined;

  constructor(action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>) {
    this.action = action;
  }

  abstract getLocation(match: Match): Location;

  /**
   * Get the builder attached to this Route.
   */
  getAttachedBuilder(): HasBuilderLink<ActionResult, string> | undefined {
    return this.#builder;
  }

  /**
   * Attach given builder as a child of this route.
   */
  attach<B extends HasBuilderLink<ActionResult, string>>(builder: B): B {
    this.#builder = builder;
    builder.getBuilderLink().attachToParent(this);
    return builder;
  }
}
