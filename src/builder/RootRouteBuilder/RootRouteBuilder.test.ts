import { RootRouteBuilder } from ".";
import { PathRouteBuilder } from "../PathRouteBuilder";
import { RoutePathResolver } from "../RoutePathResolver";
import { PathRouteRecord } from "../RouteRecord";
import { ConstRouteRecord } from "../RouteRecord/ConstRouteRecord";
import { getRouteRecordLocation } from "../RouteRecord/getRouteRecordLocation";

const emptyMatch = {} as never;

describe("RootRouteBuilder", () => {
  describe("action", () => {
    it("no action at init", () => {
      const b = RootRouteBuilder.init();
      expect(b.getRoute().action).toBeUndefined();
    });
    it("can set action", () => {
      const b = RootRouteBuilder.init().action(() => "root!");
      expect(b.route.action({})).toBe("root!");
    });
  });
  describe("location", () => {
    it("default root is root", () => {
      const b = RootRouteBuilder.init();
      expect(getRouteRecordLocation(b.getRoute(), {})).toEqual({
        pathname: "/",
        state: null,
      });
    });
    it("can change default root", () => {
      const b = RootRouteBuilder.init({
        root: {
          pathname: "/root",
          state: null,
        },
      });
      expect(getRouteRecordLocation(b.route, {})).toEqual({
        pathname: "/root",
        state: null,
      });
    });
    it("attaching to Root has no effect 1", () => {
      const toplevel = RootRouteBuilder.init();
      const sub = toplevel.getRoute().attach(PathRouteBuilder.init()).routes({
        foo: {},
      });
      expect(getRouteRecordLocation(sub.getRoutes().foo, {})).toEqual({
        pathname: "/foo",
        state: null,
      });
    });
    it("attaching to Root has no effect 2", () => {
      const toplevel = RootRouteBuilder.init({
        root: {
          pathname: "/root",
          state: {
            sta: "te",
          },
        },
      });
      const sub = toplevel.route.attach(PathRouteBuilder.init()).routes({
        foo: {},
      });
      expect(getRouteRecordLocation(sub.getRoutes().foo, {})).toEqual({
        pathname: "/root/foo",
        state: {
          sta: "te",
        },
      });
    });
    it("attaching Root resets location", () => {
      const toplevel = PathRouteBuilder.init().routes({
        foo: {},
      });
      const sub = toplevel
        .getRoutes()
        .foo.attach(RootRouteBuilder.init()).route;
      expect(getRouteRecordLocation(sub, {})).toEqual({
        pathname: "/",
        state: null,
      });
    });
  });
  describe("resolve", () => {
    describe("root resolves", () => {
      it("1", () => {
        const toplevel = RootRouteBuilder.init().action(() => "root!?");
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
            route: expect.any(ConstRouteRecord),
          },
        ]);
        expect(res[0].route.action(emptyMatch)).toBe("root!?");
      });
      it("2", () => {
        const toplevel = RootRouteBuilder.init().action(() => "root.");
        const resolver = RoutePathResolver.getFromBuilder(toplevel);
        const res = resolver.resolve({
          pathname: "/foo/bar",
          search: "key=value",
          state: null,
        });
        expect(res).toEqual([
          {
            remainingLocation: {
              pathname: "/foo/bar",
              search: "?key=value",
              state: null,
            },
            currentLocation: {
              pathname: "/",
              state: null,
            },
            match: {},
            route: expect.any(ConstRouteRecord),
          },
        ]);
        expect(res[0].route.action(emptyMatch)).toBe("root.");
      });
      it("digs attached Root", () => {
        const toplevel = PathRouteBuilder.init().routes({
          hoge: {
            action: () => "I am hoge",
          },
        });
        toplevel
          .getRoutes()
          .hoge.attach(RootRouteBuilder.init().action(() => "I am root"));
        const resolver = RoutePathResolver.getFromBuilder(toplevel);
        const res = resolver.resolve({
          pathname: "/hoge",
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
            route: expect.any(ConstRouteRecord),
          },
        ]);
        expect(res[0].route.action(emptyMatch)).toBe("I am root");
      });
      it("attaching to RootRouteResolver", () => {
        const root = RootRouteBuilder.init({
          root: {
            pathname: "/root",
            state: null,
          },
        });
        const toplevel = PathRouteBuilder.init().routes({
          hoge: {
            action: () => "I am hoge",
          },
        });
        root.attach(toplevel);
        const resolver = RoutePathResolver.getFromBuilder(root);
        const res = resolver.resolve({
          pathname: "/root/hoge",
          state: null,
        });
        expect(res).toEqual([
          {
            remainingLocation: {
              pathname: "/",
              state: null,
            },
            currentLocation: {
              pathname: "/root/hoge",
              state: null,
            },
            match: {},
            route: expect.any(PathRouteRecord),
          },
        ]);
        expect(res[0].route.action(emptyMatch)).toBe("I am hoge");
      });
    });
  });
});
