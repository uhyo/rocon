import { RoutesBuilder } from ".";
import type { LocationComposer } from "../LocationComposer";
import type { BaseState, Location } from "../LocationComposer/Location";
import type {
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
    | RoutesBuilder<
        ActionResult,
        Record<string, RouteDefinition<BaseState, ActionResult>>,
        Match
      >
    | undefined;
  readonly attach: <Defs extends RoutesDefinition<ActionResult>>(
    builder: RoutesBuilder<ActionResult, Defs, Match>
  ) => RoutesBuilder<ActionResult, Defs, Match>;
};

type ActionType<Match, ActionResult> = RouteDefinition<
  Match,
  ActionResult
>["action"];

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
  #builder?: RoutesBuilder<
    ActionResult,
    Record<string, RouteDefinition<BaseState, ActionResult>>,
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
    | RoutesBuilder<
        ActionResult,
        Record<string, RouteDefinition<BaseState, ActionResult>>,
        Match
      >
    | undefined {
    return this.#builder;
  }

  attach<Defs extends RoutesDefinition<ActionResult>>(
    builder: RoutesBuilder<ActionResult, Defs, Match>
  ): RoutesBuilder<ActionResult, Defs, Match> {
    this.#builder = builder;
    this.#config.changeRootLocation(builder, this.getLocation());
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
