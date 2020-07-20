import type { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import { RoutesBuilder } from "../RoutesBuilder";
import type {
  ActionType,
  MatchOfRouteDefinition,
  RoutesDefinition,
} from "../RoutesBuilder/RoutesDefinitionObject";
import { RouteRecordBase } from "./RouteRecordBase";
import type { RouteRecordType } from "./RouteRecordType";

export type { RouteRecordType };

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
export class RouteRecord<ActionResult, Match>
  extends RouteRecordBase<ActionResult, Match>
  implements RouteRecordType<ActionResult, Match> {
  /**
   * Key of this route.
   */
  readonly key: string;
  #config: RouteRecordConfig;

  constructor(
    config: RouteRecordConfig,
    key: string,
    action: ActionType<ActionResult, Match>
  ) {
    super(config, action);
    this.#config = config;
    this.key = key;
  }

  getLocation(): Location {
    return this.#config.composer.compose(
      this.#config.getRootLocation(),
      this.key
    );
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
