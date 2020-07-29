import type { RouteRecordConfig } from ".";
import { Location } from "../LocationComposer/Location";
import type { AttachableRoutesBuilder } from "../RoutesBuilder/AttachableRoutesBuilder";
import type { ActionType } from "../RoutesBuilder/RoutesDefinitionObject";

export type ActionTypeOfRouteRecord<
  ActionResult,
  Match,
  HasAction extends boolean
> = HasAction extends true ? ActionType<ActionResult, Match> : undefined;

/**
 * Object for each route provided by RoutesBuilder.
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
  #builder?: AttachableRoutesBuilder<ActionResult, string> = undefined;
  #config: RouteRecordConfig<string>;

  constructor(
    config: RouteRecordConfig<string>,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    this.#config = config;
    this.action = action;
  }

  abstract getLocation(match: Match): Location;

  /**
   * Get the builder attached to this Route.
   */
  getBuilder(): AttachableRoutesBuilder<ActionResult, string> | undefined {
    return this.#builder;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attach<B extends AttachableRoutesBuilder<ActionResult, string>>(
    builder: B
  ): B {
    this.#builder = builder;
    this.#config.attachBuilderToRoute(builder.getRawBuilder(), this);
    return builder;
  }
}
