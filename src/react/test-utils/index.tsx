import { act, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import React from "react";
import { Location } from "../../core/Location";
import { RoconRoot } from "../components/RoconRoot";
import { ReactElement } from "../types/ReactElement";

export const renderInHistory = (history: History, element: ReactElement) => {
  return render(<RoconRoot history={history}>{element}</RoconRoot>);
};

export const renderInLocation = (location: Location, element: ReactElement) => {
  const history = createMemoryHistory({
    initialEntries: [location],
  });
  return renderInHistory(history, element);
};

export { render, fireEvent, screen, act };
