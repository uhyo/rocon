import React, { useMemo } from "react";
import { Path } from "../shorthand";
import { renderInLocation, screen } from "../test-utils";
import { useNavigate } from "./useNavigate";
import { useRoutes } from "./useRoutes";

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
  it("renders nothing for non-matching root", () => {
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
        <Component />
      </div>
    );
    expect(screen.queryByTestId("root")?.innerHTML).toBe("");
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
    it.only("nested", () => {
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
});
