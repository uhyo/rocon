import { createMemoryHistory } from "history";
import React from "react";
import { useRoutes } from "../hooks/useRoutes";
import { Path } from "../shorthand";
import { renderInHistory, screen } from "../test-utils";
import { Link } from "./Link";

describe("Link", () => {
  it("change path by click", () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: "/foo",
          state: null,
        },
      ],
    });
    const routes = Path()
      .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
      .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
    const Component: React.FC = () => {
      const contents = useRoutes(routes);
      return (
        <div>
          <Link data-testid="link" route={routes._.bar}>
            nice link
          </Link>
          {contents}
        </div>
      );
    };

    renderInHistory(history, <Component />);
    expect(screen.queryByText("I AM BAR")).toBeNull();
    expect(history.index).toBe(0);
    screen.queryByTestId("link")?.click();
    expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
    expect(history.index).toBe(1);
    expect(history.location).toMatchObject({
      pathname: "/bar",
      state: null,
    });
  });
  it("Link has correct href", () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: "/foo",
          state: null,
        },
      ],
    });
    const routes = Path()
      .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
      .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
    const Component: React.FC = () => {
      const contents = useRoutes(routes);
      return (
        <div>
          <Link data-testid="link" route={routes._.bar}>
            nice link
          </Link>
          {contents}
        </div>
      );
    };

    renderInHistory(history, <Component />);
    expect(screen.queryByTestId("link")?.getAttribute("href")).toBe("/bar");
  });
});
