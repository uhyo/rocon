import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Location } from "../../core/Location";
import { RoconRoot } from "../components/RoconRoot";
import { ReactElement } from "../types/ReactElement";

export const renderInLocation = (location: Location, element: ReactElement) => {
  const history = createMemoryHistory({
    initialEntries: [location],
  });
  return render(<RoconRoot history={history}>{element}</RoconRoot>);
};

export { render, fireEvent, screen };
