import { PathRouteBuilder } from "../RouteBuilder/PathRouteBuilder";
import { SearchRouteBuilder } from "../RouteBuilder/SearchRouteBuilder";

describe("Composed Location resolving", () => {
  describe("path-path", () => {
    it("1", () => {
      const builder = PathRouteBuilder.init<string>().routes({
        foo: {
          action: () => "foo!",
        },
        bar: {},
      });
      const toplevel = builder.getRoutes();

      PathRouteBuilder.attachTo(toplevel.foo).routes({
        hoge: {
          action: () => "hoge.",
        },
      });

      PathRouteBuilder.attachTo(toplevel.bar).routes({
        fuga: {
          action: () => "fuga!",
        },
      });

      const resolver = builder.getResolver();
      const hogeResults = resolver.resolve({
        pathname: "/foo/hoge",
        state: null,
      });
      expect(hogeResults.length).toBe(1);
      const [hogeRoute] = hogeResults;
      expect(hogeRoute.route.action(hogeRoute.match)).toBe("hoge.");

      const fugaResults = resolver.resolve({
        pathname: "/bar/fuga",
        state: null,
      });
      expect(fugaResults.length).toBe(1);
      const [fugaRoute] = fugaResults;
      expect(fugaRoute.route.action(fugaRoute.match)).toBe("fuga!");
    });
  });
  describe("path-search", () => {
    it("1", () => {
      const builder = PathRouteBuilder.init<string>().routes({
        foo: {},
      });
      const resolver = builder.getResolver();

      SearchRouteBuilder.attachTo(builder.getRoutes().foo, "key", {
        action: ({ key }) => `key is ${key}`,
      }).getRoute();

      const result = resolver.resolve({
        pathname: "/foo",
        search: "key=value",
        state: null,
      });
      expect(result.length).toBe(1);
      const res = result[0];
      expect(res.match).toEqual({ key: "value" });
      expect(res.route.action(res.match)).toBe("key is value");
    });
  });
});
