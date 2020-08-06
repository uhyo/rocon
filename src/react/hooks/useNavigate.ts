import { History } from "history";
import { ReactElement, useContext, useMemo } from "react";
import { RouteRecordType } from "../../builder/RouteRecord";
import { getRouteRecordLocation } from "../../builder/RouteRecord/getRouteRecordLocation";
import { HistoryContext } from "../contexts/HistoryContext";
import { RouteContext } from "../contexts/RouteContext";
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
  const routeLocation = parentRoute?.routeLocation;

  const navigate = useMemo<Navigate>(() => {
    // create navigate function.
    const push = (<Match>(
      route: RouteRecordType<ReactElement | null, Match, boolean>,
      match: Match
    ) => {
      history.push(
        getRouteRecordLocation(route, match as Match, routeLocation)
      );
    }) as NavigateFunction;
    const replace = (<Match>(
      route: RouteRecordType<ReactElement | null, Match, boolean>,
      match: Match
    ) => {
      history.replace(
        getRouteRecordLocation(route, match as Match, routeLocation)
      );
    }) as NavigateFunction;
    return Object.assign(push, { push, replace });
  }, [history, routeLocation]);

  return navigate;
};
