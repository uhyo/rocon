import { RoutesBuilder } from "./";
import { RouteRecord } from "./RouteRecord";

describe("RoutesBuilder", () => {
  describe("routes", () => {
    it("Empty at init", () => {
      const b = RoutesBuilder.init();
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
      expect(routes.foo.action()).toEqual("foo!");
      expect(routes.foo.getLocation()).toEqual({
        pathname: "/foo",
        state: null,
      });
      expect(routes.bar.action()).toEqual("bar?");
      expect(routes.bar.getLocation()).toEqual({
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
      expect(routes.foo.action()).toEqual("foo!");
      expect(routes.foo.getLocation()).toEqual({
        pathname: "/foo",
        state: null,
      });
      expect(routes.bar.action()).toEqual("bar?");
      expect(routes.bar.getLocation()).toEqual({
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

    it("State handling", () => {
      const res = RoutesBuilder.init<string>().routes({
        foo: {
          action: () => "foo!",
        },
        bar: {
          action: (num: number) => `bar? ${num}`,
        },
      });
      const routes = res.getRoutes();
      expect(Object.keys(routes)).toEqual(["foo", "bar"]);
      expect(routes.foo.action()).toEqual("foo!");
      expect(routes.foo.getLocation()).toEqual({
        pathname: "/foo",
        state: null,
      });
      expect(routes.bar.action(123)).toEqual("bar? 123");
      expect(routes.bar.getLocation()).toEqual({
        pathname: "/bar",
        state: null,
      });
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
        .attach(RoutesBuilder.init())
        .routes({
          bar: {
            action: () => "bar!",
          },
        })
        .getRoutes();

      expect(sub.bar.action()).toBe("bar!");
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
        .attach(RoutesBuilder.init())
        .routes({
          bar: {
            action: () => "bar!",
          },
        })
        .getRoutes();

      expect(sub.bar.getLocation()).toEqual({
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
      expect(subRoutes.bom.getLocation()).toEqual({
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
      expect(subRoutes.bom.getLocation()).toEqual({
        pathname: "/foo/bom",
        state: null,
      });
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
