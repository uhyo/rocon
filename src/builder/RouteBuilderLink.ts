import type { BuilderLink } from "../core/BuilderLink";
import { HasBuilderLink } from "../core/BuilderLink/AttachableRouteBuilder";
import type { RouteRecordType } from "./RouteRecord";

export type RouteBuilderLinkValue<ActionResult> = RouteRecordType<
  ActionResult,
  never,
  boolean
>;

export type RouteBuilderLink<ActionResult, Segment> = BuilderLink<
  ActionResult,
  Segment,
  RouteBuilderLinkValue<ActionResult>
>;

export type AttachableRouteBuilder<ActionResult, Segment> = HasBuilderLink<
  ActionResult,
  Segment,
  RouteBuilderLinkValue<ActionResult>
>;
