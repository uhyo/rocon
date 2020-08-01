import { Path, Rocon, Search, State } from "..";
import { MatchingRouteRecord } from "../RouteBuilder/RouteRecord/MatchingRouteRecord";
import { wildcardRouteKey } from "../RouteBuilder/symbols";
import { Resolver } from "../shorthand";
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

      const resolver = Resolver(builder);
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

      const resolver = Resolver(builder);
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

      const resolver = Resolver(builder);
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
      const resolver = Resolver(builder);

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
      const tab = Search("tab");
      const ss = tab
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
    it("2", () => {
      const route = Rocon.Path()
        .routes({
          user: {},
        })
        .getRoutes()
        .user.attach(Rocon.Search("tab"))
        .attach(Rocon.State("username", isString))
        .action(({ tab, username }) => `hello, ${username}! tab=${tab}`);

      expect(
        route.getLocation({
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
    it.skip("3", () => {
      const route = Rocon.Path()
        .routes({
          user: {},
        })
        .getRoutes()
        .user.attach(Rocon.Search("tab"))
        .attach(Rocon.State("username", isString))
        .action(({ tab, username }) => `hello, ${username}! tab=${tab}`);

      const resolver = Resolver(route);
      const res = resolver.resolve({
        pathname: "/user",
        search: "tab=123",
        state: {
          username: "uhyo",
        },
      });
      expect(res.length).toBe(1);
      expect(res).toEqual([
        {
          location: {
            pathname: "/",
            search: "",
            state: {},
          },
          match: {
            tab: "123",
            username: "uhyo",
          },
          route: expect.any(MatchingRouteRecord),
        },
      ]);
    });
  });
});
