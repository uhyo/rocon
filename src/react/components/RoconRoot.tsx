import { createBrowserHistory, History, Location } from "history";
import React, { memo, useEffect, useMemo, useState } from "react";
import { RouteRecordType } from "../../builder/RouteRecord";
import { getRouteRecordLocation } from "../../builder/RouteRecord/getRouteRecordLocation";
import { HistoryContext } from "../contexts/HistoryContext";
import { LocationContext } from "../contexts/LocationContext";
import { NavigateFunction } from "../types/NavigateFunction";
import { ReactElement } from "../types/ReactElement";

export type RoconRootProps = {
  history?: History;
};

export const RoconRoot: React.FC<RoconRootProps> = memo((props) => {
  const history = useMemo(() => props.history || createBrowserHistory(), [
    props.history,
  ]);

  const historyContextValue = useMemo(() => {
    // create navigate function.
    const push = (<Match,>(
      route: RouteRecordType<ReactElement | null, Match, boolean>,
      match: Match
    ) => {
      history.push(getRouteRecordLocation(route, match as Match));
    }) as NavigateFunction;
    const replace = (<Match,>(
      route: RouteRecordType<ReactElement | null, Match, boolean>,
      match: Match
    ) => {
      history.replace(getRouteRecordLocation(route, match as Match));
    }) as NavigateFunction;
    const navigate = Object.assign(push, { push, replace });
    return {
      history,
      navigate,
    };
  }, [history]);

  const [location, setLocation] = useState<Location>(history.location);

  useEffect(() => {
    return history.listen((state) => {
      setLocation(state.location);
    });
  }, [history]);

  return (
    <HistoryContext.Provider value={historyContextValue}>
      <LocationContext.Provider value={location}>
        {props.children}
      </LocationContext.Provider>
    </HistoryContext.Provider>
  );
});
