import { RouteRecordType } from "../../builder/RouteRecord";
import { ReactElement } from "./ReactElement";

export type ReactRouteRecord<Match> = RouteRecordType<
  ReactElement | null,
  Match,
  boolean
>;
