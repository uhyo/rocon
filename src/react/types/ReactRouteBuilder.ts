import type { AttachableRouteBuilder } from "../../builder/RouteBuilderLink";
import type { ReactElement } from "./ReactElement";

export type ReactRouteBuilder = AttachableRouteBuilder<
  ReactElement | null,
  unknown
>;
