import { SearchRoutesBuilder } from ".";
import { WildcardRouteRecord } from "../../RouteRecord/WildcardRouteRecord";

describe("SearchRoutesBuilder", () => {
  describe("init", () => {
    it("has wildcard route from start", () => {
      const b = SearchRoutesBuilder.init("key", {
        action: ({ key }) => `key is ${key}`,
      });

      expect(b.getRoute()).toEqual(expect.any(WildcardRouteRecord));
    });
  });
  describe("attach", () => {
    const toplevel = SearchRoutesBuilder.init("foo", {}).getRoute();
    const sub = SearchRoutesBuilder.attachTo(toplevel, "bar", {
      action: ({ foo, bar }) => `foo is ${foo}, bar is ${bar}`,
    });
    const route = sub.getRoute();
    expect(
      route.action({
        foo: "123",
        bar: "456",
      })
    ).toBe("foo is 123, bar is 456");
  });
});
