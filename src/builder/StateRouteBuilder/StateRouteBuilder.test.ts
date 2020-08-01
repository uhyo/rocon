import { StateRouteBuilder } from ".";
import { RouteResolver } from "../../core/RouteResolver";
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
      expect(r.getLocation({ foostate: "aaa" })).toEqual({
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
      const sub = StateRouteBuilder.attachTo(toplevel, "bar", isNumber)
        .action(({ foo, bar }) => `foo=${foo} bar=${bar}`)
        .getRoute();

      expect(sub.action({ foo: "bbbb", bar: -123 })).toBe("foo=bbbb bar=-123");
    });
    it("getLocation", () => {
      const toplevel = StateRouteBuilder.init("foo", isString).getRoute();
      const sub = StateRouteBuilder.attachTo(
        toplevel,
        "bar",
        isNumber
      ).getRoute();

      expect(sub.getLocation({ foo: "あいう", bar: 555 })).toEqual({
        pathname: "/",
        state: {
          foo: "あいう",
          bar: 555,
        },
      });
    });
  });
  it("resolve", () => {
    const toplevel = StateRouteBuilder.init("foo", isString).action(
      ({ foo }) => `foo is ${foo.slice(0)}`
    );
    const res = RouteResolver.getFromBuilder(toplevel).resolve({
      pathname: "/foo",
      state: {
        foo: "I am foo",
        bar: 1234,
      },
    });
    expect(res).toEqual([
      {
        location: {
          pathname: "/foo",
          state: {
            bar: 1234,
          },
        },
        match: {
          foo: "I am foo",
        },
        route: expect.any(MatchingRouteRecord),
      },
    ]);
    expect(res[0].route.action(res[0].match)).toBe("foo is I am foo");
  });
});
