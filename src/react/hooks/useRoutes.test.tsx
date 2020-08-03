import React from "react";
import { Path } from "../shorthand";
import { renderInLocation, screen } from "../test-utils";
import { useRoutes } from "./useRoutes";

describe("useRoutes", () => {
  describe("renders matching action", () => {
    it("1", () => {
      const location = {
        pathname: "/foo",
        state: null,
      };
      const route = Path()
        .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
        .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
      const Component: React.FC = () => {
        return useRoutes(route);
      };

      renderInLocation(location, <Component />);
      expect(screen.queryByText("I am foo")).toBeInTheDocument();
    });
    it("2", () => {
      const location = {
        pathname: "/bar",
        state: null,
      };
      const route = Path()
        .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
        .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
      const Component: React.FC = () => {
        return useRoutes(route);
      };

      renderInLocation(location, <Component />);
      expect(screen.queryByText("I am foo")).toBeNull();
      expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
    });
  });
});
