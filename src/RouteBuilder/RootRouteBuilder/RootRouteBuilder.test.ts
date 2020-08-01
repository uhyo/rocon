import { RootRouteBuilder } from ".";
import { RouteResolver } from "../../RouteResolver";
import { PathRouteBuilder } from "../PathRouteBuilder";
import { IdentityRouteRecord } from "../RouteRecord/IdentityRouteRecord";

const emptyMatch = {} as never;

describe("RootRouteBuilder", () => {
  describe("action", () => {
    it("no action at init", () => {
      const b = RootRouteBuilder.init();
      expect(b.getRoute().action).toBeUndefined();
    });
    it("can set action", () => {
      const b = RootRouteBuilder.init().action(() => "root!");
      expect(b.getRoute().action({})).toBe("root!");
    });
  });
  describe("location", () => {
    it("default root is root", () => {
      const b = RootRouteBuilder.init();
      expect(b.getRoute().getLocation({})).toEqual({
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
      expect(b.getRoute().getLocation({})).toEqual({
        pathname: "/root",
        state: null,
      });
    });
    it("attaching to Root has no effect 1", () => {
      const toplevel = RootRouteBuilder.init();
      const sub = toplevel.getRoute().attach(PathRouteBuilder.init()).routes({
        foo: {},
      });
      expect(sub.getRoutes().foo.getLocation({})).toEqual({
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
      const sub = toplevel.getRoute().attach(PathRouteBuilder.init()).routes({
        foo: {},
      });
      expect(sub.getRoutes().foo.getLocation({})).toEqual({
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
        .foo.attach(RootRouteBuilder.init())
        .getRoute();
      expect(sub.getLocation({})).toEqual({
        pathname: "/",
        state: null,
      });
    });
  });
  describe("resolve", () => {
    describe("root resolves", () => {
      it("1", () => {
        const toplevel = RootRouteBuilder.init().action(() => "root!?");
        const resolver = RouteResolver.getFromBuilder(toplevel);
        const res = resolver.resolve({
          pathname: "/",
          state: null,
        });
        expect(res).toEqual([
          {
            location: {
              pathname: "/",
              state: null,
            },
            match: {},
            route: expect.any(IdentityRouteRecord),
          },
        ]);
        expect(res[0].route.action(emptyMatch)).toBe("root!?");
      });
      it("2", () => {
        const toplevel = RootRouteBuilder.init().action(() => "root.");
        const resolver = RouteResolver.getFromBuilder(toplevel);
        const res = resolver.resolve({
          pathname: "/foo/bar",
          search: "key=value",
          state: null,
        });
        expect(res).toEqual([
          {
            location: {
              pathname: "/foo/bar",
              search: "key=value",
              state: null,
            },
            match: {},
            route: expect.any(IdentityRouteRecord),
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
        const resolver = RouteResolver.getFromBuilder(toplevel);
        const res = resolver.resolve({
          pathname: "/hoge",
          state: null,
        });
        expect(res).toEqual([
          {
            location: {
              pathname: "/",
              state: null,
            },
            match: {},
            route: expect.any(IdentityRouteRecord),
          },
        ]);
        expect(res[0].route.action(emptyMatch)).toBe("I am root");
      });
    });
  });
});
