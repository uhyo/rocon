import { PathRoutesBuilder } from ".";
import { wildcardRouteKey } from "../../BuilderLink/symbols";

describe("PathRoutesBuilder", () => {
  describe("routes", () => {
    it("Empty at init", () => {
      const b = PathRoutesBuilder.init();
      expect(b.getRoutes()).toEqual({});
    });

    it("Reflects one routes() call", () => {
      const res = PathRoutesBuilder.init<string>().routes({
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
      const res = PathRoutesBuilder.init<string>()
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
      const b1 = PathRoutesBuilder.init<string>().routes({
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
  });

  describe("attach", () => {
    it("composed location action", () => {
      const toplevel = PathRoutesBuilder.init<string>()
        .routes({
          foo: {
            action: () => "foo!",
          },
        })
        .getRoutes();
      const sub = toplevel.foo
        .attach(PathRoutesBuilder.init<string>())
        .routes({
          bar: {
            action: () => "bar!",
          },
        })
        .getRoutes();

      expect(sub.bar.action({})).toBe("bar!");
    });
    it("composed location object", () => {
      const toplevel = PathRoutesBuilder.init<string>()
        .routes({
          foo: {
            action: () => "foo!",
          },
        })
        .getRoutes();
      const sub = toplevel.foo
        .attach(PathRoutesBuilder.init<string>())
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
      const sub = PathRoutesBuilder.init<string>().routes({
        bom: {
          action: () => "bom!",
        },
      });
      const subRoutes = sub.getRoutes();
      expect(subRoutes.bom.getLocation({})).toEqual({
        pathname: "/bom",
        state: null,
      });

      const toplevel = PathRoutesBuilder.init<string>()
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
  });

  describe("any route", () => {
    it("any works like wildcard", () => {
      const res = PathRoutesBuilder.init<string>().any("id", {
        action: ({ id }) => `id is ${id.slice(0, 8)}`,
      });
      const routes = res.getRoutes();
      expect(routes[wildcardRouteKey].route.action({ id: "wow" })).toEqual(
        "id is wow"
      );
    });
    it("sub route of any", () => {
      const res = PathRoutesBuilder.init<string>().any("id", {
        action: ({ id }) => `id is ${id.slice(0, 8)}`,
      });
      const routes = res.getRoutes();
      const subRoutes = PathRoutesBuilder.attachTo(
        routes[wildcardRouteKey].route
      )
        .routes({
          hoge: {
            action: () => "sub",
          },
        })
        .getRoutes();

      expect(subRoutes.hoge.getLocation({ id: "wow" })).toEqual({
        pathname: "/wow/hoge",
        state: null,
      });
    });
  });
});
