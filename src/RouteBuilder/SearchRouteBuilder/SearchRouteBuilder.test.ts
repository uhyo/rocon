import { SearchRouteBuilder } from ".";
import { MatchingRouteRecord } from "../RouteRecord/WildcardRouteRecord";

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
    const toplevel = SearchRouteBuilder.init("foo", {}).getRoute();
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
});
