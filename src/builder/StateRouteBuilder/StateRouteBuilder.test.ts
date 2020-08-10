import { StateRouteBuilder } from ".";
import { RoutePathResolver } from "../RoutePathResolver";
import { getRouteRecordLocation } from "../RouteRecord/getRouteRecordLocation";
import { MatchingRouteRecord } from "../RouteRecord/MatchingRouteRecord";

const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number";

describe("StateRouteBuilder", () => {
  describe("init", () => {
    it("has wildcard route from start", () => {
      const b = StateRouteBuilder.init("foostate", isString).action(
        ({ foostate }) => `foo is ${foostate.slice(0)}`
      );

      expect(b.getRoute()).toEqual(expect.any(MatchingRouteRecord));
    });
    it("getRoute", () => {
      const b = StateRouteBuilder.init("foostate", isString).action(
        ({ foostate }) => `foo is ${foostate.slice(0)}`
      );
      const r = b.getRoute();
      expect(r.action({ foostate: "abc" })).toBe("foo is abc");
    });
    it("getLocation", () => {
      const b = StateRouteBuilder.init("foostate", isString).action(
        ({ foostate }) => `foo is ${foostate.slice(0)}`
      );
      const r = b.getRoute();
      expect(getRouteRecordLocation(r, { foostate: "aaa" })).toEqual({
        pathname: "/",
        state: {
          foostate: "aaa",
        },
      });
    });
  });

  describe("attach", () => {
    it("action", () => {
      const toplevel = StateRouteBuilder.init("foo", isString).getRoute();
      const sub = toplevel
        .attach(StateRouteBuilder.init("bar", isNumber))
        .action(({ foo, bar }) => `foo=${foo} bar=${bar}`)
        .getRoute();

      expect(sub.action({ foo: "bbbb", bar: -123 })).toBe("foo=bbbb bar=-123");
    });
    it("getLocation", () => {
      const toplevel = StateRouteBuilder.init("foo", isString).getRoute();
      const sub = toplevel
        .attach(StateRouteBuilder.init("bar", isNumber))
        .getRoute();

      expect(getRouteRecordLocation(sub, { foo: "あいう", bar: 555 })).toEqual({
        pathname: "/",
        state: {
          foo: "あいう",
          bar: 555,
        },
      });
    });
  });
  describe("resolve", () => {
    it("matchKey = stateKey", () => {
      const toplevel = StateRouteBuilder.init("foo", isString).action(
        ({ foo }) => `foo is ${foo.slice(0)}`
      );
      const res = RoutePathResolver.getFromBuilder(toplevel).resolve({
        pathname: "/foo",
        state: {
          foo: "I am foo",
          bar: 1234,
        },
      });
      expect(res).toEqual([
        {
          remainingLocation: {
            pathname: "/foo",
            state: {
              bar: 1234,
            },
          },
          currentLocation: {
            pathname: "/",
            state: {
              foo: "I am foo",
            },
          },
          match: {
            foo: "I am foo",
          },
          route: expect.any(MatchingRouteRecord),
        },
      ]);
      expect(res[0].route.action(res[0].match as never)).toBe(
        "foo is I am foo"
      );
    });
    it("matchKey != stateKey", () => {
      const toplevel = StateRouteBuilder.init("foo", isNumber, {
        stateKey: "wow",
      }).action(({ foo }) => `foo is ${foo.toFixed(2)}`);
      const res = RoutePathResolver.getFromBuilder(toplevel).resolve({
        pathname: "/foo",
        state: {
          foo: "I am foo",
          wow: 1234,
        },
      });
      expect(res).toEqual([
        {
          remainingLocation: {
            pathname: "/foo",
            state: {
              foo: "I am foo",
            },
          },
          currentLocation: {
            pathname: "/",
            state: {
              wow: 1234,
            },
          },
          match: {
            foo: 1234,
          },
          route: expect.any(MatchingRouteRecord),
        },
      ]);
      expect(res[0].route.action(res[0].match as never)).toBe("foo is 1234.00");
    });
    it("optional state", () => {
      const toplevel = StateRouteBuilder.init("foo", isNumber, {
        optional: true,
      }).action(({ foo }) => `foo is ${foo?.toFixed(2)}`);
      const res = RoutePathResolver.getFromBuilder(toplevel).resolve({
        pathname: "/foo",
        state: {
          wow: 1234,
        },
      });
      expect(res).toEqual([
        {
          remainingLocation: {
            pathname: "/foo",
            state: {
              wow: 1234,
            },
          },
          currentLocation: {
            pathname: "/",
            state: {},
          },
          match: {
            foo: undefined,
          },
          route: expect.any(MatchingRouteRecord),
        },
      ]);
      expect(res[0].route.action(res[0].match as never)).toBe(
        "foo is undefined"
      );
    });
  });
});
