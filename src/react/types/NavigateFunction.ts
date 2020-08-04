import { RouteRecordType } from "../../builder/RouteRecord";
import { ReactElement } from "./ReactElement";

export type NavigateFunction = <Match>(
  route: RouteRecordType<ReactElement | null, Match, boolean>,
  ...args:{} extends Match ? [] : [match: Match]
) => void;

export type Navigate = NavigateFunction & {
  push: NavigateFunction
  replace: NavigateFunction
}
