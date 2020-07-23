import type { RouteRecordConfig } from ".";
import { Location } from "../LocationComposer/Location";
import type { AttachableRoutesBuilder } from "../RoutesBuilder/AttachableRoutesBuilder";
import type {
  ActionType,
  RouteDefinition,
} from "../RoutesBuilder/RoutesDefinitionObject";
import { WildcardFlagType } from "../RoutesBuilder/WildcardFlagType";

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
  #builder?: AttachableRoutesBuilder<
    ActionResult,
    Record<string, RouteDefinition<ActionResult, Match>>,
    WildcardFlagType,
    Match
  > = undefined;
  #config: RouteRecordConfig;

  constructor(
    config: RouteRecordConfig,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    this.#config = config;
    this.action = action;
  }

  abstract getLocation(match: Match): Location;

  /**
   * Get the builder attached to this Route.
   */
  getBuilder():
    | AttachableRoutesBuilder<
        ActionResult,
        Record<string, RouteDefinition<ActionResult, Match>>,
        WildcardFlagType,
        Match
      >
    | undefined {
    return this.#builder;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attach<B extends AttachableRoutesBuilder<ActionResult, any, any, Match>>(
    builder: B
  ): B {
    this.#builder = builder;
    this.#config.attachBuilderToRoute(builder.getRawBuilder(), this);
    return builder;
  }
}
