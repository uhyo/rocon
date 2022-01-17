/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PathRouteBuilder } from ".";
import { RoutePathResolver } from "../RoutePathResolver";
import { PathRouteRecord } from "../RouteRecord";
import { getRouteRecordLocation } from "../RouteRecord/getRouteRecordLocation";

describe("PathRouteBuilder", () => {
  describe("routes", () => {
    it("Empty at init", () => {
      const b = PathRouteBuilder.init();
      expect(b.getRoutes()).toEqual({});
    });

    it("Reflects one routes() call", () => {
      const res = PathRouteBuilder.init<string>().routes({
        foo: {
          action: () => "foo!",
        },
        bar: {
          action: () => "bar?",
        },
      });
      const routes = res.getRoutes();
      expect(Object.keys(routes)).toEqual(["foo", "bar"]);
      expect(routes.foo.action({})).toEqual("foo!");
      expect(getRouteRecordLocation(routes.foo, {})).toEqual({
        pathname: "/foo",
        state: null,
      });
      expect(routes.bar.action({})).toEqual("bar?");
      expect(getRouteRecordLocation(routes.bar, {})).toEqual({
        pathname: "/bar",
        state: null,
      });
    });

    it("Reflects two routes() calls", () => {
      const res = PathRouteBuilder.init<string>()
        .routes({
          foo: {
            action: () => "foo!",
          },
        })
        .routes({
          bar: {
            action: () => "bar?",
          },
        });
      const routes = res.getRoutes();
      expect(Object.keys(routes)).toEqual(["foo", "bar"]);
      expect(routes.foo.action({})).toEqual("foo!");
      expect(getRouteRecordLocation(routes.foo, {})).toEqual({
        pathname: "/foo",
        state: null,
      });
      expect(routes.bar.action({})).toEqual("bar?");
      expect(getRouteRecordLocation(routes.bar, {})).toEqual({
        pathname: "/bar",
        state: null,
      });
    });
  });
  describe("route", () => {
    it("just add one route", () => {
      const b = PathRouteBuilder.init();
      const res = b.route("foo");

      const routes = res.getRoutes();
      expect(Object.keys(routes)).toEqual(["foo"]);
      expect(routes.foo.action).toBeUndefined();
    });
    it("add route and set action", () => {
      const b = PathRouteBuilder.init();
      const res = b.route("foo", (foo) => foo.action(() => "I am foo"));

      const routes = res.getRoutes();
      expect(routes.foo.action?.({})).toBe("I am foo");
    });
    it("add multipe routes one by one", () => {
      const b = PathRouteBuilder.init();
      const res = b
        .route("foo", (foo) => foo.action(() => "I am foo"))
        .route("bar", (bar) => bar.action(() => "Hello, bar"));

      const routes = res.getRoutes();
      expect(routes.foo.action?.({})).toBe("I am foo");
      expect(routes.bar.action?.({})).toBe("Hello, bar");
    });
    it("attach in route", () => {
      const sub = PathRouteBuilder.init().route("abc", (abc) =>
        abc.action(() => "abcdefg")
      );
      const toplevel = PathRouteBuilder.init();
      toplevel.route("foo", (foo) => foo.attach(sub));

      expect(getRouteRecordLocation(sub.getRoutes().abc, {})).toEqual({
        pathname: "/foo/abc",
        state: null,
      });
    });
  });

  describe("attach", () => {
    it("composed location action", () => {
      const toplevel = PathRouteBuilder.init<string>()
        .routes({
          foo: {
            action: () => "foo!",
          },
        })
        .getRoutes();
      const sub = toplevel.foo
        .attach(PathRouteBuilder.init<string>())
        .routes({
          bar: {
            action: () => "bar!",
          },
        })
        .getRoutes();

      expect(sub.bar.action({})).toBe("bar!");
    });
    it("composed location object", () => {
      const toplevel = PathRouteBuilder.init<string>()
        .routes({
          foo: {
            action: () => "foo!",
          },
        })
        .getRoutes();
      const sub = toplevel.foo
        .attach(PathRouteBuilder.init<string>())
        .routes({
          bar: {
            action: () => "bar!",
          },
        })
        .getRoutes();

      expect(getRouteRecordLocation(sub.bar, {})).toEqual({
        pathname: "/foo/bar",
        state: null,
      });
    });
    it("change location after attach", () => {
      const sub = PathRouteBuilder.init<string>().routes({
        bom: {
          action: () => "bom!",
        },
      });
      const subRoutes = sub.getRoutes();
      expect(getRouteRecordLocation(subRoutes.bom, {})).toEqual({
        pathname: "/bom",
        state: null,
      });

      const toplevel = PathRouteBuilder.init<string>()
        .routes({
          foo: {
            action: () => "foo!",
          },
        })
        .getRoutes();
      toplevel.foo.attach(sub);
      expect(getRouteRecordLocation(subRoutes.bom, {})).toEqual({
        pathname: "/foo/bom",
        state: null,
      });
    });
  });

  describe("any route", () => {
    it("any works like wildcard", () => {
      const res = PathRouteBuilder.init<string>().any("id", {
        action: ({ id }) => `id is ${id.slice(0, 8)}`,
      });
      expect(res.anyRoute.action({ id: "wow" })).toEqual("id is wow");
    });
    it("any route requires Match object", () => {
      const res = PathRouteBuilder.init<string>().any("id", {
        action: ({ id }) => `id is ${id.slice(0, 8)}`,
      });
      expect(() => {
        // @ts-expect-error
        res.anyRoute.action({});
      }).toThrow();
    });
    it("sub route of any", () => {
      const res = PathRouteBuilder.init<string>().any("id", {
        action: ({ id }) => `id is ${id.slice(0, 8)}`,
      });
      const subRoutes = res.anyRoute
        .attach(PathRouteBuilder.init())
        .routes({
          hoge: {
            action: () => "sub",
          },
        })
        .getRoutes();

      expect(getRouteRecordLocation(subRoutes.hoge, { id: "wow" })).toEqual({
        pathname: "/wow/hoge",
        state: null,
      });
    });
    it("any works without routeDefinition(2nd argument)", () => {
      const res = PathRouteBuilder.init<string>().any("id");
      const subRoutes = res.anyRoute
        .attach(PathRouteBuilder.init())
        .routes({
          hoge: {
            action: () => "sub",
          },
        })
        .getRoutes();

      expect(getRouteRecordLocation(subRoutes.hoge, { id: "wow" })).toEqual({
        pathname: "/wow/hoge",
        state: null,
      });
    });
    it("any does not modify other route's Match type", () => {
      const res = PathRouteBuilder.init<string>()
        .any("id", {
          action: ({ id }) => `id is ${id.slice(0, 8)}`,
        })
        .route("foo", (route) => route.action(() => "foo"));
      expect(getRouteRecordLocation(res._.foo, {})).toEqual({
        pathname: "/foo",
        state: null,
      });
    });
  });

  describe("exact route", () => {
    it("root route location", () => {
      const res = PathRouteBuilder.init().exact({
        action: () => "I am root",
      });
      expect(getRouteRecordLocation(res.exactRoute, {})).toEqual({
        pathname: "/",
        state: null,
      });
    });
    it("root route action", () => {
      const res = PathRouteBuilder.init().exact({
        action: () => "I am root",
      });
      expect(res.exactRoute.action({})).toBe("I am root");
    });
    it("root works with any route", () => {
      const res = PathRouteBuilder.init()
        .exact({
          action: () => "I am root",
        })
        .any("id", {
          action: ({ id }) => `id is ${id.slice(0, 8)}`,
        });
      expect(res.exactRoute.action({})).toBe("I am root");
    });
    describe("resolve", () => {
      it("resolve root", () => {
        const toplevel = PathRouteBuilder.init()
          .exact({
            action: () => "I am root",
          })
          .route("foo", (foo) => foo.action(() => "I am foo"));
        const resolver = RoutePathResolver.getFromBuilder(toplevel);
        const res = resolver.resolve({
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
              state: null,
            },
            match: {},
            route: expect.any(PathRouteRecord),
          },
        ]);
        expect(res[0].route.action(res[0].match as never)).toBe("I am root");
      });
    });
    it("attached sub root", () => {
      const toplevel = PathRouteBuilder.init()
        .exact({
          action: () => "I am root",
        })
        .route("foo", (foo) => foo.action(() => "I am foo"));
      toplevel._.foo.attach(PathRouteBuilder.init()).exact({
        action: () => "I am foo exact",
      });
      const resolver = RoutePathResolver.getFromBuilder(toplevel);
      const res = resolver.resolve({
        pathname: "/foo",
        state: null,
      });
      expect(res).toEqual([
        {
          remainingLocation: {
            pathname: "/",
            state: null,
          },
          currentLocation: {
            pathname: "/foo",
            state: null,
          },
          match: {},
          route: expect.any(PathRouteRecord),
        },
      ]);
      expect(res[0].route.action(res[0].match as never)).toBe("I am foo exact");
    });
  });
});
