import { SingleHashRouteBuilder } from ".";
import { RoutePathResolver } from "../RoutePathResolver";
import { MatchingRouteRecord } from "../RouteRecord/MatchingRouteRecord";

describe("SingleHashRouteBuilder", () => {
  describe("init", () => {
    it("has wildcard route from start", () => {
      const b = SingleHashRouteBuilder.init("key").action(
        ({ key }) => `key is ${key}`
      );

      expect(b.getRoute()).toEqual(expect.any(MatchingRouteRecord));
    });
  });
  it("attach", () => {
    const toplevel = SingleHashRouteBuilder.init("foo").getRoute();
    const sub = toplevel
      .attach(SingleHashRouteBuilder.init("bar"))
      .action(({ foo, bar }) => `foo is ${foo}, bar is ${bar}`);
    const route = sub.getRoute();
    expect(
      route.action({
        foo: "123",
        bar: "456",
      })
    ).toBe("foo is 123, bar is 456");
  });
  describe("resolve", () => {
    it("basic", () => {
      const toplevel = SingleHashRouteBuilder.init("foo").action(
        ({ foo }) => `foo is ${foo.slice(0)}`
      );
      const res = RoutePathResolver.getFromBuilder(toplevel).resolve({
        pathname: "/",
        hash: "#aiueo",
        state: null,
      });
      expect(res).toEqual([
        {
          remainingLocation: {
            pathname: "/",
            hash: "",
            state: null,
          },
          currentLocation: {
            pathname: "/",
            hash: "#aiueo",
            state: null,
          },
          match: {
            foo: "aiueo",
          },
          route: expect.any(MatchingRouteRecord),
        },
      ]);
      expect(res[0].route.action(res[0].match as never)).toBe("foo is aiueo");
    });
  });
  it("does not resolve for no hash string", () => {
    const toplevel = SingleHashRouteBuilder.init("foo").action(
      ({ foo }) => `foo is ${foo.slice(0)}`
    );
    const res = RoutePathResolver.getFromBuilder(toplevel).resolve({
      pathname: "/",
      hash: "",
      state: null,
    });
    expect(res).toEqual([]);
  });
  it("optional flag allows nonexistent query param", () => {
    const toplevel = SingleHashRouteBuilder.init("foo", {
      optional: true,
    }).action(({ foo }) => `foo is ${foo?.slice(0)}`);
    const res = RoutePathResolver.getFromBuilder(toplevel).resolve({
      pathname: "/",
      state: null,
    });
    expect(res).toEqual([
      {
        remainingLocation: {
          pathname: "/",
          state: null,
        },
        currentLocation: {
          pathname: "/",
          hash: "",
          state: null,
        },
        match: {
          foo: undefined,
        },
        route: expect.any(MatchingRouteRecord),
      },
    ]);
  });
});
