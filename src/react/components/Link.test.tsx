import { createMemoryHistory } from "history";
import React from "react";
import { useRoutes } from "../hooks/useRoutes";
import { Path, SingleHash } from "../shorthand";
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
  it("Link uses match object", () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: "/foo",
          state: null,
        },
      ],
    });
    const hashRoute = SingleHash("hash").action(({ hash }) => (
      <p>hash is {hash}</p>
    ));
    const routes = Path()
      .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
      .route("bar", (bar) => bar.attach(hashRoute));
    const Component: React.FC = () => {
      const contents = useRoutes(routes);
      return (
        <div>
          <Link
            data-testid="link"
            route={hashRoute.route}
            match={{ hash: "abcde" }}
          >
            nice link
          </Link>
          {contents}
        </div>
      );
    };

    renderInHistory(history, <Component />);
    expect(screen.queryByTestId("link")?.getAttribute("href")).toBe(
      "/bar#abcde"
    );
  });
  it("No match object is treated as empty object", () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: "/foo",
          state: null,
        },
      ],
    });
    const hashRoute = SingleHash("hash", {
      optional: true,
    }).action(({ hash }) => <p>hash is {hash}</p>);
    const routes = Path()
      .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
      .route("bar", (bar) => bar.attach(hashRoute));
    const Component: React.FC = () => {
      const contents = useRoutes(routes);
      return (
        <div>
          <Link data-testid="link" route={hashRoute.route}>
            nice link
          </Link>
          {contents}
        </div>
      );
    };

    renderInHistory(history, <Component />);
    expect(screen.queryByTestId("link")?.getAttribute("href")).toBe("/bar");
  });
  it("correct link handling in nested routes", () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: "/foo/bar",
          state: null,
        },
      ],
    });
    const fooRoutes = Path().route("bar", (bar) =>
      bar.action(() => (
        <div>
          <p>I AM BAR</p>
          <Link data-testid="link" route={fooRoutes._.bar}>
            link
          </Link>
        </div>
      ))
    );
    const routes = Path().route("foo", (foo) => foo.attach(fooRoutes));

    const Component: React.FC = () => {
      return useRoutes(routes);
    };

    renderInHistory(history, <Component />);
    expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
    expect(screen.queryByTestId("link")?.getAttribute("href")).toBe("/foo/bar");
    screen.queryByTestId("link")?.click();
    expect(history.location).toMatchObject({
      pathname: "/foo/bar",
      state: null,
    });
    expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
  });
  it("forwarding ref works", () => {
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
    const ref = React.createRef<HTMLAnchorElement>();
    const Component: React.FC = () => {
      const contents = useRoutes(routes);
      return (
        <div>
          <Link data-testid="link" route={routes._.bar} ref={ref}>
            nice link
          </Link>
          {contents}
        </div>
      );
    };

    renderInHistory(history, <Component />);
    expect(ref.current?.getAttribute("href")).toBe("/bar");
  });
});
