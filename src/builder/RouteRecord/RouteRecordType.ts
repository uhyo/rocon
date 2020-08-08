import type { HasBuilderLink } from "../../core/BuilderLink/HasBuilderLink";
import type { PathRouteBuilder } from "../PathRouteBuilder";
import { RouteBuilderLink } from "../RouteBuilderLink";
import type { RoutesDefinition } from "../RoutesDefinitionObject";
import type { SearchRouteBuilder } from "../SearchRouteBuilder";
import type { StateRouteBuilder } from "../StateRouteBuilder";
import type {
  routeRecordParentKey,
  routeRecordSegmentGetterKey,
} from "../symbols";
import type {
  ExistingWildcardFlagType,
  WildcardFlagType,
} from "../WildcardFlagType";
import type { ActionTypeOfRouteRecord } from "./RouteRecordBase";

/**
 * When adding a new builder, it should also be added here for better type inference.
 */
export interface AttachFunction<ActionResult, Match> {
  <
    Defs extends RoutesDefinition<ActionResult>,
    AnyFlag extends WildcardFlagType,
    ExactFlag extends WildcardFlagType,
    IntrinsicMatch
  >(
    builder: PathRouteBuilder<
      ActionResult,
      Defs,
      AnyFlag,
      ExactFlag,
      IntrinsicMatch
    >
  ): PathRouteBuilder<
    ActionResult,
    Defs,
    AnyFlag,
    ExactFlag,
    IntrinsicMatch & Match
  >;
  <WildcardFlag extends ExistingWildcardFlagType, IntrinsicMatch>(
    builder: SearchRouteBuilder<ActionResult, WildcardFlag, IntrinsicMatch>
  ): SearchRouteBuilder<ActionResult, WildcardFlag, IntrinsicMatch & Match>;
  <StateValue, WildcardFlag extends ExistingWildcardFlagType, IntrinsicMatch>(
    builder: StateRouteBuilder<
      ActionResult,
      StateValue,
      WildcardFlag,
      IntrinsicMatch
    >
  ): StateRouteBuilder<
    ActionResult,
    StateValue,
    WildcardFlag,
    IntrinsicMatch & Match
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <B extends HasBuilderLink<ActionResult, any, any>>(builder: B): B;
}

/**
 * Route object internally stored in RouteBuilder.
 */
export type RouteRecordType<ActionResult, Match, HasAction extends boolean> = {
  readonly action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>;
  readonly [routeRecordParentKey]: RouteBuilderLink<ActionResult, unknown>;
  readonly [routeRecordSegmentGetterKey]: (match: Match) => unknown;
  readonly getAttachedBuilderLink: () =>
    | RouteBuilderLink<ActionResult, unknown>
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly attach: AttachFunction<ActionResult, Match>;
};
