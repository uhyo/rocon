import { createMemoryHistory } from "history";
import React from "react";
import { Path } from "../shorthand";
import { renderInHistory, screen } from "../test-utils";
import { useNavigate } from "./useNavigate";
import { useRoutes } from "./useRoutes";

describe("useNavigate", () => {
  it("call navigate to change path", () => {
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
      const navigate = useNavigate();
      return (
        <div>
          <button data-testid="button" onClick={() => navigate(routes._.bar)}>
            button
          </button>
          {contents}
        </div>
      );
    };

    renderInHistory(history, <Component />);
    expect(screen.queryByText("I AM BAR")).toBeNull();
    expect(history.index).toBe(0);
    screen.queryByTestId("button")?.click();
    expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
    expect(history.index).toBe(1);
    expect(history.location).toMatchObject({
      pathname: "/bar",
      state: null,
    });
  });
  it("call navigate.push to change path", () => {
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
      const navigate = useNavigate();
      return (
        <div>
          <button
            data-testid="button"
            onClick={() => navigate.push(routes.getRoutes().bar)}
          >
            button
          </button>
          {contents}
        </div>
      );
    };

    renderInHistory(history, <Component />);
    expect(screen.queryByText("I AM BAR")).toBeNull();
    expect(history.index).toBe(0);
    screen.queryByTestId("button")?.click();
    expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
    expect(history.index).toBe(1);
    expect(history.location).toMatchObject({
      pathname: "/bar",
      state: null,
    });
  });
  it("call navigate.replace to change path", () => {
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
      const navigate = useNavigate();
      return (
        <div>
          <button
            data-testid="button"
            onClick={() => navigate.replace(routes.getRoutes().bar)}
          >
            button
          </button>
          {contents}
        </div>
      );
    };

    renderInHistory(history, <Component />);
    expect(screen.queryByText("I AM BAR")).toBeNull();
    expect(history.index).toBe(0);
    screen.queryByTestId("button")?.click();
    expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
    expect(history.index).toBe(0);
    expect(history.location).toMatchObject({
      pathname: "/bar",
      state: null,
    });
  });
});
