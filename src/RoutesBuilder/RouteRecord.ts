import { RoutesBuilder } from ".";
import type { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import type { AttachableRoutesBuilder } from "./AttachableRoutesBuilder";
import type {
  ActionType,
  MatchOfRouteDefinition,
  RouteDefinition,
  RoutesDefinition,
} from "./RoutesDefinitionObject";

/**
 * Route object internally stored in RoutesBuilder.
 */
export type RouteRecordType<ActionResult, Match> = RouteDefinition<
  Match,
  ActionResult
> & {
  readonly getLocation: () => Location;
  readonly getBuilder: () =>
    | AttachableRoutesBuilder<
        ActionResult,
        Record<string, RouteDefinition<Match, ActionResult>>,
        Match
      >
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly attach: <
    B extends AttachableRoutesBuilder<ActionResult, any, Match>
  >(
    builder: B
  ) => B;
};

export type RouteRecordConfig = {
  composer: LocationComposer<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRootLocation: () => Location<any>;
  changeRootLocation: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: RoutesBuilder<any, any, any>,
    newRoot: Location
  ) => void;
};

/**
 * Object for each route provided by RoutesBuilder.
 * Should implement RouteRecordType.
 * @package
 */
export class RouteRecord<ActionResult, Match> {
  /**
   * Key of this route.
   */
  readonly key: string;
  /**
   * Action of this route.
   */
  readonly action: ActionType<Match, ActionResult>;
  #builder?: AttachableRoutesBuilder<
    ActionResult,
    Record<string, RouteDefinition<Match, ActionResult>>,
    Match
  > = undefined;
  #config: RouteRecordConfig;

  constructor(
    config: RouteRecordConfig,
    key: string,
    action: ActionType<Match, ActionResult>
  ) {
    this.#config = config;
    this.key = key;
    this.action = action;
  }

  getLocation(): Location {
    return this.#config.composer.compose(
      this.#config.getRootLocation(),
      this.key
    );
  }

  /**
   * Get the builder attached to this Route.
   */
  getBuilder():
    | AttachableRoutesBuilder<
        ActionResult,
        Record<string, RouteDefinition<Match, ActionResult>>,
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
      this.getLocation()
    );
    return builder;
  }
}

export type RoutesDefinitionToRouteRecords<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>
> = {
  [P in Extract<keyof Defs, string>]: RouteRecordType<
    ActionResult,
    MatchOfRouteDefinition<Defs[P]>
  >;
};
