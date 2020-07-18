import { RoutesBuilder } from ".";
import type { LocationComposer } from "../LocationComposer";
import type { BaseState, Location } from "../LocationComposer/Location";
import type {
  RouteDefinitionByState,
  RoutesDefinition,
  StateOfRouteDefinition,
} from "./RoutesDefinitionObject";

/**
 * Route object internally stored in RoutesBuilder.
 */
export type RouteRecordType<
  State extends BaseState,
  ActionResult
> = RouteDefinitionByState<State, ActionResult> & {
  readonly getLocation: () => Location<State>;
  readonly attach: <Defs extends RoutesDefinition<ActionResult>>(
    builder: RoutesBuilder<ActionResult, Defs>
  ) => RoutesBuilder<ActionResult, Defs>;
};

export type StateOfRouteRecordType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RR extends RouteRecordType<any, any>
> = ReturnType<RR["getLocation"]> extends Location<infer S> ? S : BaseState;

type ActionType<State, ActionResult> = State extends undefined
  ? () => ActionResult
  : (state: State) => ActionResult;

export type RouteRecordConfig = {
  composer: LocationComposer<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRootLocation: () => Location<any>;
  changeRootLocation: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: RoutesBuilder<any, any>,
    newRoot: Location
  ) => void;
};

/**
 * Object for each route provided by RoutesBuilder.
 * Should implement RouteRecordType.
 * @package
 */
export class RouteRecord<State extends BaseState, ActionResult> {
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
      this.#config.getRootLocation(),
      this.key
    ) as unknown) as Location<State>;
  }

  attach<Defs extends RoutesDefinition<ActionResult>>(
    builder: RoutesBuilder<ActionResult, Defs>
  ): RoutesBuilder<ActionResult, Defs> {
    this.#config.changeRootLocation(builder, this.getLocation());
    return builder;
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
