import type React from "react";
import { RouteRecordType } from "../../builder/RouteRecord";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReactElement = React.ReactElement<any, any>;

export type ReactRouteRecord<Match> = RouteRecordType<
  ReactElement | null,
  Match,
  boolean
>;
