import type { HasBuilderLink } from "../../BuilderLink/AttachableRouteBuilder";
import type { Location } from "../../LocationComposer/Location";
import { AddMatchToRouteBuilder } from "../AddMatchToRouteBuilder";
import { ActionTypeOfRouteRecord } from "./RouteRecordBase";

/**
 * Route object internally stored in RouteBuilder.
 */
export type RouteRecordType<ActionResult, Match, HasAction extends boolean> = {
  readonly action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>;
  readonly getLocation: (match: Match) => Location;
  readonly getAttachedBuilder: () =>
    | HasBuilderLink<ActionResult, string>
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly attach: <B extends HasBuilderLink<ActionResult, any>>(
    builder: B
  ) => AddMatchToRouteBuilder<Match, B>;
};
