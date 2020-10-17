import { createMemoryHistory } from "history";
import React, { useEffect, useState } from "react";
import { useRoutes } from "../hooks/useRoutes";
import { Path } from "../shorthand";
import { renderInHistory, screen } from "../test-utils";
import { Redirect } from "./Redirect";

describe("Redirect", () => {
  it("changes path on rendering", async () => {
    const history = createMemoryHistory({
      initialEntries: [
        {
          pathname: "/foo",
          state: null,
        },
      ],
    });
    const Foo: React.FC = () => {
      const [redirect, setRedirect] = useState(false);
      useEffect(() => {
        setTimeout(() => setRedirect(true), 100);
      }, []);
      return redirect ? (
        <Redirect route={routes._.bar} />
      ) : (
        <div>Redirecting...</div>
      );
    };
    const routes = Path()
      .route("foo", (foo) =>
        foo.action(() => {
          return <Foo />;
        })
      )
      .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
    const Component: React.FC = () => {
      const contents = useRoutes(routes);
      return contents;
    };

    renderInHistory(history, <Component />);
    expect(await screen.findByText("I AM BAR")).toBeInTheDocument();
    expect(history.index).toBe(0);
    expect(history.location).toMatchObject({
      pathname: "/bar",
      state: null,
    });
  });
});
