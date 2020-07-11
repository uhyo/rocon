import { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import type {
  RouteDefinitionByState,
  RoutesDefinition,
  StateOfRouteDefinition,
} from "./RoutesDefinitionObject";

/**
 * Route object internally stored in RoutesBuilder.
 */
export type RouteRecordType<State, ActionResult> = RouteDefinitionByState<
  State,
  ActionResult
> & {
  getLocation: () => Location<State>;
};

type ActionType<State, ActionResult> = State extends undefined
  ? () => ActionResult
  : (state: State) => ActionResult;

export type RouteRecordConfig = {
  composer: LocationComposer<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rootLocation: Location<any>;
};

/**
 * @package
 */
export class RouteRecord<State, ActionResult> {
  /**
   * Key of this route.
   */
  readonly key: string;
  /**
   * Action of this route.
   */
  readonly action: ActionType<State, ActionResult>;
  #config: RouteRecordConfig;

  constructor(
    config: RouteRecordConfig,
    key: string,
    action: ActionType<State, ActionResult>
  ) {
    this.#config = config;
    this.key = key;
    this.action = action;
  }

  getLocation(): Location<State> {
    return (this.#config.composer.compose(
      this.#config.rootLocation,
      this.key
    ) as unknown) as Location<State>;
  }
}

export type RoutesDefinitionToRouteRecords<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>
> = {
  [P in keyof Defs]: RouteRecordType<
    StateOfRouteDefinition<Defs[P]>,
    ActionResult
  >;
};
