import React, { useMemo, useState } from "react";
import {
  isLocationNotFoundError,
  LocationNotFoundError,
} from "../errors/LocationNotFoundError";
import { Path } from "../shorthand";
import { renderInLocation, screen } from "../test-utils";
import { useNavigate } from "./useNavigate";
import { useRoutes } from "./useRoutes";

class LocationNotFoundErrorBoundary extends React.Component<
  {},
  {
    error?: LocationNotFoundError;
  }
> {
  state: {
    error?: LocationNotFoundError;
  } = {};
  componentDidCatch(error: unknown) {
    if (isLocationNotFoundError(error)) {
      this.setState({
        error,
      });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <p data-testid="error">
          Caught a LocationNotFoundError: {this.state.error.message}
        </p>
      );
    }
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

describe("useRoutes", () => {
  describe("renders matching action", () => {
    it("1", () => {
      const location = {
        pathname: "/foo",
        state: null,
      };
      const routes = Path()
        .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
        .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
      const Component: React.FC = () => {
        return useRoutes(routes);
      };

      renderInLocation(location, <Component />);
      expect(screen.queryByText("I am foo")).toBeInTheDocument();
    });
    it("2", () => {
      const location = {
        pathname: "/bar",
        state: null,
      };
      const routes = Path()
        .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
        .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
      const Component: React.FC = () => {
        return useRoutes(routes);
      };

      renderInLocation(location, <Component />);
      expect(screen.queryByText("I am foo")).toBeNull();
      expect(screen.queryByText("I AM BAR")).toBeInTheDocument();
    });
  });
  it("throws error for non-matching route", () => {
    const location = {
      pathname: "/baz",
      state: null,
    };
    const routes = Path()
      .route("foo", (foo) => foo.action(() => <p>I am foo</p>))
      .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
    const Component: React.FC = () => {
      return useRoutes(routes);
    };

    renderInLocation(
      location,
      <div data-testid="root">
        <LocationNotFoundErrorBoundary>
          <Component />
        </LocationNotFoundErrorBoundary>
      </div>
    );
    expect(screen.queryByTestId("error")).toBeInTheDocument();
  });
  describe("auto-attach", () => {
    it("attaches to parent", () => {
      const location = {
        pathname: "/foo/hoge",
        state: null,
      };
      const topRoutes = Path()
        .route("foo", (foo) =>
          foo.action(() => (
            <div>
              <p>I am foo</p>
              <SecondComponent />
            </div>
          ))
        )
        .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
      const TopComponent: React.FC = () => {
        return useRoutes(topRoutes);
      };

      const secondRoutes = Path().routes({
        hoge: {
          action: () => <p>hogehoge</p>,
        },
        fuga: {
          action: () => <p>fugafuga</p>,
        },
      });
      const SecondComponent: React.FC = () => {
        return useRoutes(secondRoutes);
      };

      renderInLocation(
        location,
        <div>
          <TopComponent />
        </div>
      );
      expect(screen.queryByText("I am foo")).toBeInTheDocument();
      expect(screen.queryByText("hogehoge")).toBeInTheDocument();
    });
    it("nested", () => {
      const location = {
        pathname: "/foo/hoge",
        state: null,
      };
      const topRoutes = Path()
        .route("foo", (foo) =>
          foo.action(() => (
            <div>
              <p>I am foo</p>
              <SecondComponent />
            </div>
          ))
        )
        .route("bar", (bar) =>
          bar.action(() => (
            <div>
              <p>I AM BAR</p>
              <SecondComponent />
            </div>
          ))
        );

      const TopComponent: React.FC = () => {
        return useRoutes(topRoutes);
      };

      const SecondComponent: React.FC = () => {
        const secondRoutes = useMemo(
          () =>
            Path().routes({
              hoge: {
                action: () => <p>hogehoge</p>,
              },
              fuga: {
                action: () => <p>fugafuga</p>,
              },
            }),
          []
        );
        const contents = useRoutes(secondRoutes);
        const navigate = useNavigate();

        return (
          <div>
            <button
              data-testid="fugaButton"
              onClick={() => navigate(secondRoutes._.fuga)}
            >
              fuga
            </button>
            {contents}
          </div>
        );
      };

      renderInLocation(
        location,
        <div>
          <TopComponent />
        </div>
      );
      expect(screen.queryByText("I am foo")).toBeInTheDocument();
      expect(screen.queryByText("hogehoge")).toBeInTheDocument();
      screen.queryByTestId("fugaButton")?.click();
      expect(screen.queryByText("I am foo")).toBeInTheDocument();
      expect(screen.queryByText("fugafuga")).toBeInTheDocument();
    });
  });
  describe("React Component as action", () => {
    it("1", () => {
      const FooComponent = () => {
        const loc = useState("foo");
        return <p>I am {loc}</p>;
      };
      const location = {
        pathname: "/foo",
        state: null,
      };
      const routes = Path()
        .route("foo", (foo) => foo.action(FooComponent))
        .route("bar", (bar) => bar.action(() => <div>I AM BAR</div>));
      const Component: React.FC = () => {
        return useRoutes(routes);
      };

      renderInLocation(location, <Component />);
      expect(screen.queryByText("I am foo")).toBeInTheDocument();
    });
  });
});
