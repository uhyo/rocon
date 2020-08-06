import { Path, Rocon, Search, State } from "..";
import { getRouteRecordLocation } from "../builder/RouteRecord/getRouteRecordLocation";
import { MatchingRouteRecord } from "../builder/RouteRecord/MatchingRouteRecord";
import { wildcardRouteKey } from "../builder/symbols";
import { Resolver } from "../shorthand";
import { isString } from "../validator";

// TODO: remove `as never` by introducing better API

describe("Composed Location resolving", () => {
  describe("path-path", () => {
    it("1", () => {
      const builder = Path<string>()
        .route("foo", (foo) =>
          foo
            .action(() => "foo!")
            .attach(Path())
            .route("hoge", (hoge) => hoge.action(() => "hoge."))
        )
        .route("bar", (bar) =>
          bar.attach(Path()).route("fuga", (fuga) => fuga.action(() => "fuga!"))
        );

      const resolver = Resolver(builder);
      const hogeResults = resolver.resolve({
        pathname: "/foo/hoge",
        state: null,
      });
      expect(hogeResults.length).toBe(1);
      const [hogeRoute] = hogeResults;
      expect(hogeRoute.route.action(hogeRoute.match as never)).toBe("hoge.");

      const fugaResults = resolver.resolve({
        pathname: "/bar/fuga",
        state: null,
      });
      expect(fugaResults.length).toBe(1);
      const [fugaRoute] = fugaResults;
      expect(fugaRoute.route.action(fugaRoute.match as never)).toBe("fuga!");
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
      expect(res.route.action(res.match as never)).toBe("Hello, user uhyo");
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
      expect(res.route.action(res.match as never)).toBe("Hello, user uhyo");
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
      expect(res.route.action(res.match as never)).toBe("key is value");
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
        getRouteRecordLocation(ss.getRoute(), {
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
    it("3", () => {
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
    it("4", () => {
      const route = Rocon.Path().route("user", (user) =>
        user
          .attach(Rocon.Search("tab"))
          .attach(Rocon.State("username", isString))
          .action(({ tab, username }) => `hello, ${username}! tab=${tab}`)
      );

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
