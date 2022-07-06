import { createMemoryHistory } from "history";
import React from "react";
import Rocon, { Link, useRoutes } from "../react";
import { act, renderInHistory, screen } from "../react/test-utils";

const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

const topRoutes = Rocon.Path()
  .exact({
    action: () => <p>Top Route</p>,
  })
  .route("users");

const userWithState = topRoutes._.users
  .attach(Rocon.Path())
  .any("user_id")
  .anyRoute.attach(Rocon.State("sampleState", isBoolean, { optional: true }))
  .action(({ sampleState }) => <p>SampleState is {String(sampleState)}</p>);

export default function App() {
  const renderedRoute = useRoutes(topRoutes);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <ul>
        <li>
          <Link route={topRoutes.exactRoute}>Top</Link>
        </li>
        <li>
          {" "}
          <Link
            route={userWithState.route}
            match={{ sampleState: false, user_id: "uhyo" }}
          >
            SampleState=false
          </Link>
        </li>
        <li>
          <Link
            route={userWithState.route}
            match={{ sampleState: true, user_id: "uhyo" }}
          >
            SampleState=true
          </Link>
        </li>
      </ul>
      <hr />
      {renderedRoute}
    </div>
  );
}

it("useRoutes can resolve route when state is false", () => {
  const history = createMemoryHistory({
    initialEntries: [
      {
        pathname: "/users/uhyo",
        state: {
          sampleState: false,
        },
      },
    ],
  });
  renderInHistory(history, <App />);
  expect(history.location).toMatchObject({
    pathname: "/users/uhyo",
    state: {
      sampleState: false,
    },
  });
  expect(screen.queryByText("SampleState is false")).toBeInTheDocument();
});

it("useRoutes can resolve route when state is true", () => {
  const history = createMemoryHistory({
    initialEntries: [
      {
        pathname: "/users/uhyo",
        state: {
          sampleState: true,
        },
      },
    ],
  });
  renderInHistory(history, <App />);
  expect(history.location).toMatchObject({
    pathname: "/users/uhyo",
    state: {
      sampleState: true,
    },
  });
  expect(screen.queryByText("SampleState is true")).toBeInTheDocument();
});

it("Can link to route with state", () => {
  const history = createMemoryHistory({
    initialEntries: [
      {
        pathname: "/",
        state: null,
      },
    ],
  });
  renderInHistory(history, <App />);
  act(() => {
    screen.queryByText("SampleState=true")?.click();
  });
  expect(history.location).toMatchObject({
    pathname: "/users/uhyo",
    state: {
      sampleState: true,
    },
  });
  expect(screen.queryByText("SampleState is true")).toBeInTheDocument();
});
