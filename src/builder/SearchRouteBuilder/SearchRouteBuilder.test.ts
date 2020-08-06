import { SearchRouteBuilder } from ".";
import { RoutePathResolver } from "../RoutePathResolver";
import { MatchingRouteRecord } from "../RouteRecord/MatchingRouteRecord";

describe("SearchRouteBuilder", () => {
  describe("init", () => {
    it("has wildcard route from start", () => {
      const b = SearchRouteBuilder.init("key").action(
        ({ key }) => `key is ${key}`
      );

      expect(b.getRoute()).toEqual(expect.any(MatchingRouteRecord));
    });
  });
  it("attach", () => {
    const toplevel = SearchRouteBuilder.init("foo").getRoute();
    const sub = SearchRouteBuilder.attachTo(toplevel, "bar").action(
      ({ foo, bar }) => `foo is ${foo}, bar is ${bar}`
    );
    const route = sub.getRoute();
    expect(
      route.action({
        foo: "123",
        bar: "456",
      })
    ).toBe("foo is 123, bar is 456");
  });
  describe("resolve", () => {
    it("matchKey = seacrhKey", () => {
      const toplevel = SearchRouteBuilder.init("foo").action(
        ({ foo }) => `foo is ${foo.slice(0)}`
      );
      const res = RoutePathResolver.getFromBuilder(toplevel).resolve({
        pathname: "/",
        search: "foo=aiueo",
        state: null,
      });
      expect(res).toEqual([
        {
          remainingLocation: {
            pathname: "/",
            search: "",
            state: null,
          },
          currentLocation: {
            pathname: "/",
            search: "foo=aiueo",
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
  it("matchKey != seacrhKey", () => {
    const toplevel = SearchRouteBuilder.init("foo", {
      searchKey: "boom",
    }).action(({ foo }) => `foo is ${foo.slice(0)}`);
    const res = RoutePathResolver.getFromBuilder(toplevel).resolve({
      pathname: "/",
      search: "boom=wow&foo=123",
      state: null,
    });
    expect(res).toEqual([
      {
        remainingLocation: {
          pathname: "/",
          search: "foo=123",
          state: null,
        },
        currentLocation: {
          pathname: "/",
          search: "boom=wow",
          state: null,
        },
        match: {
          foo: "wow",
        },
        route: expect.any(MatchingRouteRecord),
      },
    ]);
    expect(res[0].route.action(res[0].match as never)).toBe("foo is wow");
  });
});
