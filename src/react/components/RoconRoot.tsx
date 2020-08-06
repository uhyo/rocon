import { createBrowserHistory, History, Location } from "history";
import React, { memo, useEffect, useMemo, useState } from "react";
import { HistoryContext } from "../contexts/HistoryContext";
import { LocationContext } from "../contexts/LocationContext";

export type RoconRootProps = {
  history?: History;
};

export const RoconRoot: React.FC<RoconRootProps> = memo((props) => {
  const history = useMemo(() => props.history || createBrowserHistory(), [
    props.history,
  ]);

  const historyContextValue = useMemo(() => {
    return {
      history,
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
