import { createMemoryHistory } from "history";
import React, { Fragment } from "react";
import { isLocationNotFoundError, Link, Rocon, useRoutes } from "../react";
import { renderInHistory, screen } from "../react/test-utils";

type State = {
  notFound: boolean;
};

export class ErrorBoundary extends React.Component<any> {
  state: State = {
    notFound: false,
  };

  componentDidCatch(error: unknown) {
    if (isLocationNotFoundError(error)) {
      this.setState({
        notFound: true,
      });
    } else {
      throw error;
    }
  }

  render() {
    if (this.state.notFound) {
      return <div>Not Found</div>;
    } else {
      return <Fragment>{this.props.children}</Fragment>;
    }
  }
}

const topLevelRoutes = Rocon.Root({
  root: {
    pathname: "/dir",
    state: null,
  },
})
  .attach(Rocon.Path())
  .exact({ action: () => <p>top</p> })
  .routes({
    foo: {
      action: () => <p>This is foo</p>,
    },
    bar: {
      action: () => <p>This is bar</p>,
    },
  });

const Nav = () => (
  <ul>
    <li>
      <Link route={topLevelRoutes.exactRoute}>top</Link>
    </li>
    <li>
      <Link route={topLevelRoutes._.foo}>foo</Link>
    </li>
    <li>
      <Link route={topLevelRoutes._.bar}>bar</Link>
    </li>
  </ul>
);

const Routes = () => useRoutes(topLevelRoutes);

function App() {
  return (
    <div>
      <Nav />
      <hr />
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
    </div>
  );
}

it("useRoutes can resolve route", () => {
  // https://github.com/uhyo/rocon/issues/24
  const history = createMemoryHistory({
    initialEntries: [
      {
        pathname: "/dir/foo",
        state: null,
      },
    ],
  });
  renderInHistory(history, <App />);
  expect(history.location).toMatchObject({
    pathname: "/dir/foo",
    state: null,
  });
  expect(screen.queryByText("This is foo")).toBeInTheDocument();
});
