import { createMemoryHistory } from "history";
import React from "react";
import { State } from "..";
import { Path, SingleHash } from "../shorthand";
import { fireEvent, renderInHistory, screen } from "../test-utils";
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
    fireEvent.click(screen.queryByTestId("button")!);
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
    fireEvent.click(screen.queryByTestId("button")!);
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
    fireEvent.click(screen.queryByTestId("button")!);
    expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
    expect(history.index).toBe(0);
    expect(history.location).toMatchObject({
      pathname: "/bar",
      state: null,
    });
  });
  it("no match is treated as empty object", () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: "/foo",
          state: null,
        },
      ],
    });
    const routes = SingleHash("hash", { optional: true })
      .attach(Path())
      .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
      .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
    const Component: React.FC = () => {
      const contents = useRoutes(routes);
      const navigate = useNavigate();
      return (
        <div>
          <button
            data-testid="button"
            onClick={() => navigate.push(routes._.bar)}
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
    fireEvent.click(screen.queryByTestId("button")!);
    expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
    expect(history.index).toBe(1);
    expect(history.location).toMatchObject({
      pathname: "/bar",
      state: null,
    });
  });
  it("Correctly pass location state to history.push", () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: "/foo",
          state: null,
        },
      ],
    });
    const isBoolean = (value: unknown): value is boolean =>
      typeof value === "boolean";
    const routes = Path()
      .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
      .route("bar");
    const barRoute = routes._.bar
      .attach(State("barState", isBoolean))
      .action(({ barState }) => (
        <div>barState is {String(barState)}</div>
      )).route;

    const Component: React.FC = () => {
      const contents = useRoutes(routes);
      const navigate = useNavigate();
      return (
        <div>
          <button
            data-testid="button"
            onClick={() => navigate(barRoute, { barState: true })}
          >
            button
          </button>
          {contents}
        </div>
      );
    };

    renderInHistory(history, <Component />);
    expect(history.index).toBe(0);
    fireEvent.click(screen.queryByTestId("button")!);
    expect(screen.queryByText("barState is true")).toBeInTheDocument();
    expect(history.index).toBe(1);
    expect(history.location).toMatchObject({
      pathname: "/bar",
      state: {
        barState: true,
      },
    });
  });
});
