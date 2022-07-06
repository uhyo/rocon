import { History } from "history";
import { ReactElement, useContext, useMemo } from "react";
import { RouteRecordType } from "../../builder/RouteRecord";
import { getRouteRecordLocation } from "../../builder/RouteRecord/getRouteRecordLocation";
import { HistoryContext } from "../contexts/HistoryContext";
import { RouteContext } from "../contexts/RouteContext";
import { getNavigationBaseLocation } from "../logic/getNavigationBaseLocation";
import { Navigate, NavigateFunction } from "../types/NavigateFunction";

const cache = new WeakMap<History, Navigate>();

/**
 * Returns the navigate function.
 */
export const useNavigate = (): Navigate => {
  const historyContextObject = useContext(HistoryContext);
  const parentRoute = useContext(RouteContext);
  if (historyContextObject === undefined) {
    throw new Error(
      "No history found in the context. Please make sure you have placed RoconRoot above."
    );
  }
  const { history } = historyContextObject;

  const navigate = useMemo<Navigate>(() => {
    // create navigate function.
    const push = (<Match>(
      route: RouteRecordType<ReactElement | null, Match, boolean>,
      match: Match
    ) => {
      const baseLocation = getNavigationBaseLocation(parentRoute, route);
      const nextLocation = getRouteRecordLocation(
        route,
        (match || {}) as Match,
        baseLocation
      );
      if (nextLocation.state) {
        history.push(nextLocation, nextLocation.state);
      } else {
        history.push(nextLocation);
      }
    }) as NavigateFunction;
    const replace = (<Match>(
      route: RouteRecordType<ReactElement | null, Match, boolean>,
      match: Match
    ) => {
      const baseLocation = getNavigationBaseLocation(parentRoute, route);
      const nextLocation = getRouteRecordLocation(
        route,
        (match || {}) as Match,
        baseLocation
      );
      history.replace(
        getRouteRecordLocation(route, (match || {}) as Match, baseLocation)
      );
      if (nextLocation.state) {
        history.replace(nextLocation, nextLocation.state);
      } else {
        history.replace(nextLocation);
      }
    }) as NavigateFunction;
    return Object.assign(push, { push, replace });
  }, [history, parentRoute]);

  return navigate;
};
