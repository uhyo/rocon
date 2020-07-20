import type { RouteRecordConfig } from ".";
import { Location } from "../LocationComposer/Location";
import type { AttachableRoutesBuilder } from "../RoutesBuilder/AttachableRoutesBuilder";
import type {
  ActionType,
  RouteDefinition,
} from "../RoutesBuilder/RoutesDefinitionObject";

/**
 * Object for each route provided by RoutesBuilder.
 * Should implement RouteRecordType.
 */
export abstract class RouteRecordBase<ActionResult, Match> {
  /**
   * Action of this route.
   */
  readonly action: ActionType<ActionResult, Match>;
  #builder?: AttachableRoutesBuilder<
    ActionResult,
    Record<string, RouteDefinition<ActionResult, Match>>,
    Match
  > = undefined;
  #config: RouteRecordConfig;

  constructor(
    config: RouteRecordConfig,
    action: ActionType<ActionResult, Match>
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
        Match
      >
    | undefined {
    return this.#builder;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attach<B extends AttachableRoutesBuilder<ActionResult, any, Match>>(
    builder: B
  ): B {
    this.#builder = builder;
    this.#config.changeRootLocation(
      builder.getRawBuilder(),
      // TODO: revisit this API
      this.getLocation(({} as unknown) as Match)
    );
    return builder;
  }
}
