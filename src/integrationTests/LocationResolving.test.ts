import { Path, Search, State } from "../RouteBuilder/initializers";
import { wildcardRouteKey } from "../RouteBuilder/symbols";
import { isString } from "../validator";

describe("Composed Location resolving", () => {
  describe("path-path", () => {
    it("1", () => {
      const builder = Path<string>().routes({
        foo: {
          action: () => "foo!",
        },
        bar: {},
      });
      const toplevel = builder.getRoutes();

      toplevel.foo.attach(Path()).routes({
        hoge: {
          action: () => "hoge.",
        },
      });

      toplevel.bar.attach(Path()).routes({
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
    it("2", () => {
      const builder = Path<string>().routes({
        user: {},
      });
      builder
        .getRoutes()
        .user.attach(Path())
        .any("id", {
          action: ({ id }) => `Hello, user ${id}`,
        });

      const resolver = builder.getResolver();
      const results = resolver.resolve({
        pathname: "/user/uhyo",
        state: null,
      });
      expect(results.length).toBe(1);
      const [res] = results;
      expect(res.route.action(res.match)).toBe("Hello, user uhyo");
    });
    it("3", () => {
      const builder = Path<string>().any("user", {});
      builder
        .getRoutes()
        [wildcardRouteKey].route.attach(Path<string>())
        .routes({
          profile: {
            action: ({ user }) => `Hello, user ${user}`,
          },
        });

      const resolver = builder.getResolver();
      const results = resolver.resolve({
        pathname: "/uhyo/profile",
        state: null,
      });
      expect(results.length).toBe(1);
      const [res] = results;
      expect(res.route.action(res.match)).toBe("Hello, user uhyo");
    });
  });
  describe("path-search", () => {
    it("1", () => {
      const builder = Path<string>().routes({
        foo: {},
      });
      const resolver = builder.getResolver();

      builder
        .getRoutes()
        .foo.attach(Search("key"))
        .action(({ key }) => `key is ${key}`)
        .getRoute();

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
  describe("path-search-state", () => {
    it("1", () => {
      const tab = Search("tab", {});
      const ss = tab
        .getRoute()
        .attach(State("username", isString))
        .action(({ tab, username }) => `hello, ${username}! tab=${tab}`);

      Path()
        .routes({
          user: {},
        })
        .getRoutes()
        .user.attach(tab);

      expect(
        ss.getRoute().getLocation({
          tab: "123",
          username: "uhyo",
        })
      ).toEqual({
        pathname: "/user",
        search: "tab=123",
        state: {
          username: "uhyo",
        },
      });
    });
  });
});
