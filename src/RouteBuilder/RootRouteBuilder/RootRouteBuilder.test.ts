import { RootRouteBuilder } from ".";
import { PathRouteBuilder } from "../PathRouteBuilder";

describe("RootRouteBuilder", () => {
  describe("action", () => {
    it("no action at init", () => {
      const b = RootRouteBuilder.init();
      expect(b.getRoute().action).toBeUndefined();
    });
    it.skip("can set action", () => {
      const b = RootRouteBuilder.init().action(() => "root!");
      expect(b.getRoute().action()).toBe("root!");
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
    it("attaching Root has no effect", () => {
      const toplevel = PathRouteBuilder.init().routes({
        foo: {},
      });
      const sub = toplevel
        .getRoutes()
        .foo.attach(RootRouteBuilder.init())
        .getRoute();
      expect(sub.getLocation({})).toEqual({
        pathname: "/foo",
        state: null,
      });
    });
  });
});
