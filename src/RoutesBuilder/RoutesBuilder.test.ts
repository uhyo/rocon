import { RouteRecord } from "../RouteRecord";
import { WildcardRouteRecord } from "../RouteRecord/WildcardRouteRecord";
import { RoutesBuilder } from "./";
import { wildcardRouteKey } from "./symbols";

describe.skip("RoutesBuilder", () => {
  describe("routes", () => {
    it("Empty at init", () => {
      const b = RoutesBuilder.init(options1);
      expect(b.getRoutes()).toEqual({});
    });

    it("Reflects one routes() call", () => {
      const res = RoutesBuilder.init<string>().routes({
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
      expect(routes.foo.getLocation({})).toEqual({
        pathname: "/foo",
        state: null,
      });
      expect(routes.bar.action({})).toEqual("bar?");
      expect(routes.bar.getLocation({})).toEqual({
        pathname: "/bar",
        state: null,
      });
    });

    it("Reflects two routes() calls", () => {
      const res = RoutesBuilder.init<string>()
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
      expect(routes.foo.getLocation({})).toEqual({
        pathname: "/foo",
        state: null,
      });
      expect(routes.bar.action({})).toEqual("bar?");
      expect(routes.bar.getLocation({})).toEqual({
        pathname: "/bar",
        state: null,
      });
    });

    it("RoutesBuilder is immutable", () => {
      const b1 = RoutesBuilder.init<string>().routes({
        foo: {
          action: () => "foo!",
        },
      });
      const b2 = b1.routes({
        bar: {
          action: () => "bar?",
        },
      });
      const routes1 = b1.getRoutes();
      expect(Object.keys(routes1)).toEqual(["foo"]);
      const routes2 = b2.getRoutes();
      expect(Object.keys(routes2)).toEqual(["foo", "bar"]);
    });

    it("no action route", () => {
      const res = RoutesBuilder.init<string>().routes({
        foo: {},
        bar: {
          action: () => "bar?",
        },
      });
      const routes = res.getRoutes();
      expect(Object.keys(routes)).toEqual(["foo", "bar"]);
      expect(routes.foo.action).toBeUndefined();
      expect(routes.foo.getLocation({})).toEqual({
        pathname: "/foo",
        state: null,
      });
      expect(routes.bar.action({})).toEqual("bar?");
      expect(routes.bar.getLocation({})).toEqual({
        pathname: "/bar",
        state: null,
      });
    });
  });

  describe("wildcard", () => {
    it("define wilecard route", () => {
      const b = RoutesBuilder.init<string>().wildcard("k", {
        action: ({ k }) => `k is ${k}`,
      });

      const routes = b.getRoutes();

      expect(routes).toEqual({
        [wildcardRouteKey]: {
          matchKey: "k",
          route: expect.any(WildcardRouteRecord),
        },
      });
      expect(
        routes[wildcardRouteKey].route.action({
          k: "123",
        })
      ).toBe("k is 123");
    });
  });

  describe("attach", () => {
    it("composed location action", () => {
      const toplevel = RoutesBuilder.init<string>()
        .routes({
          foo: {
            action: () => "foo!",
          },
        })
        .getRoutes();
      const sub = toplevel.foo
        .attach(RoutesBuilder.init<string>())
        .routes({
          bar: {
            action: () => "bar!",
          },
        })
        .getRoutes();

      expect(sub.bar.action({})).toBe("bar!");
    });
    it("composed location object", () => {
      const toplevel = RoutesBuilder.init<string>()
        .routes({
          foo: {
            action: () => "foo!",
          },
        })
        .getRoutes();
      const sub = toplevel.foo
        .attach(RoutesBuilder.init<string>())
        .routes({
          bar: {
            action: () => "bar!",
          },
        })
        .getRoutes();

      expect(sub.bar.getLocation({})).toEqual({
        pathname: "/foo/bar",
        state: null,
      });
    });
    it("change location after attach", () => {
      const sub = RoutesBuilder.init<string>().routes({
        bom: {
          action: () => "bom!",
        },
      });
      const subRoutes = sub.getRoutes();
      expect(subRoutes.bom.getLocation({})).toEqual({
        pathname: "/bom",
        state: null,
      });

      const toplevel = RoutesBuilder.init<string>()
        .routes({
          foo: {
            action: () => "foo!",
          },
        })
        .getRoutes();
      toplevel.foo.attach(sub);
      expect(subRoutes.bom.getLocation({})).toEqual({
        pathname: "/foo/bom",
        state: null,
      });
    });
    it("attach to wildcard", () => {
      const toplevel = RoutesBuilder.init<string>()
        .wildcard("id", {
          action: ({ id }) => `id is ${id}`,
        })
        .getRoutes();
      const sub = toplevel[wildcardRouteKey].route
        .attach(RoutesBuilder.init<string, { id: unknown }>())
        .routes({
          bar: {
            action: ({ id }) => `bar! id is ${id}`,
          },
        })
        .getRoutes();

      expect(
        sub.bar.getLocation({
          id: "random",
        })
      ).toEqual({
        pathname: "/random/bar",
        state: null,
      });
      expect(sub.bar.action({ id: 123 })).toBe("bar! id is 123");
    });
    it("attach to no-action route", () => {
      const toplevel = RoutesBuilder.init<string>()
        .routes({
          foo: {},
        })
        .getRoutes();
      const sub = toplevel.foo
        .attach(RoutesBuilder.init<string>())
        .routes({
          wow: {
            action: () => "wow",
          },
        })
        .getRoutes();

      expect(sub.wow.action({})).toBe("wow");
    });
    it("no attaching twice", () => {
      const { foo } = RoutesBuilder.init<string>()
        .routes({
          foo: {},
        })
        .getRoutes();

      const sub = RoutesBuilder.init<string>();
      foo.attach(sub);
      expect(() => foo.attach(sub)).toThrow();
    });
  });

  describe("getResolver", () => {
    const resolver = RoutesBuilder.init<string>()
      .routes({
        foo: {
          action: () => "foo!",
        },
        bar: {
          action: () => "bar?",
        },
      })
      .getResolver();
    expect(
      resolver.resolve({
        pathname: "/foo",
        state: null,
      })
    ).toEqual([
      {
        route: expect.any(RouteRecord),
        match: {},
        location: {
          pathname: "/",
          state: null,
        },
      },
    ]);
  });
});
