import { BuilderLink } from "../../BuilderLink";
import type { HasBuilderLink } from "../../BuilderLink/AttachableRouteBuilder";
import type { Location } from "../../LocationComposer/Location";
import { AddMatchToRouteBuilder } from "../AddMatchToRouteBuilder";
import { PathRouteBuilder } from "../PathRouteBuilder";
import { RoutesDefinition } from "../RoutesDefinitionObject";
import { SearchRouteBuilder } from "../SearchRouteBuilder";
import { StateRouteBuilder } from "../StateRouteBuilder";
import { routeRecordParentKey } from "../symbols";
import {
  ExistingWildcardFlagType,
  WildcardFlagType,
} from "../WildcardFlagType";
import { ActionTypeOfRouteRecord } from "./RouteRecordBase";

/**
 * When adding a new builder, it should also be added here for better type inference.
 */
export interface AttachFunction<ActionResult, Match> {
  <
    Defs extends RoutesDefinition<ActionResult>,
    WildcardFlag extends WildcardFlagType,
    IntrinsicMatch
  >(
    builder: PathRouteBuilder<ActionResult, Defs, WildcardFlag, IntrinsicMatch>
  ): PathRouteBuilder<ActionResult, Defs, WildcardFlag, IntrinsicMatch & Match>;
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
  <B extends HasBuilderLink<ActionResult, any>>(
    builder: B
  ): AddMatchToRouteBuilder<Match, B>;
}

/**
 * Route object internally stored in RouteBuilder.
 */
export type RouteRecordType<ActionResult, Match, HasAction extends boolean> = {
  readonly action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>;
  readonly [routeRecordParentKey]: BuilderLink<ActionResult, unknown>;
  readonly getLocation: (match: Match) => Location;
  readonly getAttachedBuilderLink: () =>
    | BuilderLink<ActionResult, unknown>
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly attach: AttachFunction<ActionResult, Match>;
};
