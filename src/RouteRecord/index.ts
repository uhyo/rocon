import type { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import { RoutesBuilder } from "../RoutesBuilder";
import type {
  ActionType,
  RoutesDefinition,
} from "../RoutesBuilder/RoutesDefinitionObject";
import { RouteRecordBase } from "./RouteRecordBase";
import type { RouteRecordType } from "./RouteRecordType";

export type { RouteRecordType };

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RouteRecordConfig = {
  composer: LocationComposer<string>;
  getRootLocation: (match: any) => Location<any>;
  /**
   * Attach given builder to a route.
   */
  attachBuilderToRoute: (
    builder: RoutesBuilder<any, any, any, any>,
    route: RouteRecordType<any, any>
  ) => void;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

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

  getLocation(match: Match): Location {
    const parentLocation = this.#config.getRootLocation(match);
    return this.#config.composer.compose(parentLocation, this.key);
  }
}

export type RoutesDefinitionToRouteRecords<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  Match
> = {
  [P in Extract<keyof Defs, string>]: RouteRecordType<ActionResult, Match>;
};
