import { useMemo } from "react";
import { RouteRecordType } from "../../builder/RouteRecord";
import { Navigate, NavigateFunction } from "../types/NavigateFunction";
import { ReactElement } from "../types/ReactElement";
import { useHistory } from "./useHistory";

/**
 * Returns the navigate function.
 */
export const useNavigate = (): Navigate => {
  const history = useHistory();

  return useMemo<Navigate>(() => {
    const push = (<Match>(
      route: RouteRecordType<ReactElement | null, Match, boolean>,
      match: Match
    ) => {
      history.push(route.getLocation(match as Match));
    }) as NavigateFunction;
    const replace = (<Match>(
      route: RouteRecordType<ReactElement | null, Match, boolean>,
      match: Match
    ) => {
      history.replace(route.getLocation(match as Match));
    }) as NavigateFunction;
    return Object.assign(push, { push, replace });
  }, [history]);
};
