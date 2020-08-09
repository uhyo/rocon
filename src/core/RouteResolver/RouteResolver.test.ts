import { PathRouteBuilder } from "../../builder/PathRouteBuilder";
import { RoutePathResolver } from "../../builder/RoutePathResolver";
import { PathRouteRecord } from "../../builder/RouteRecord";
import { MatchingRouteRecord } from "../../builder/RouteRecord/MatchingRouteRecord";

// TODO: rewrite the test to not depend on builder
const b1 = PathRouteBuilder.init<string>().routes({
  foo: {
    action: () => "foo!",
  },
  bar: {
    action: () => "bar",
  },
  baz: {
    action: () => "baz.",
  },
  noaction: {},
});

// TODO: clone
const b2 = PathRouteBuilder.init<string>()
  .routes({
    foo: {
      action: () => "foo!",
    },
    bar: {
      action: () => "bar",
    },
    baz: {
      action: () => "baz.",
    },
    noaction: {},
  })
  .any("id", {
    action: ({ id }) => `id is ${id}`,
  });

b1._.foo.attach(
  PathRouteBuilder.init<string>().routes({
    hoge: {
      action: () => "hoge",
    },
  })
);

b1._.bar.attach(PathRouteBuilder.init<string>()).routes({
  fuga: {
    action: () => "fuga",
  },
});
b2._.bar.attach(PathRouteBuilder.init<string>()).routes({
  fuga: {
    action: () => "fuga",
  },
});

b1._.noaction.attach(
  PathRouteBuilder.init<string>().routes({
    wow: {
      action: () => "wow",
    },
  })
);

const resolver = RoutePathResolver.getFromBuilder(b1);
const wildcardResolver = RoutePathResolver.getFromBuilder(b2);

const emptyMatch = {} as never;

describe("RouteResolver", () => {
  describe("resolves shallow location", () => {
    it("1", () => {
      const resolved = resolver.resolve({
        pathname: "/foo",
        state: {
          sta: "te",
        },
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, remainingLocation: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(PathRouteRecord));
      expect(routeRecord.action(emptyMatch)).toBe("foo!");
      expect(next).toEqual({
        pathname: "/",
        state: {
          sta: "te",
        },
      });
    });
    it("2", () => {
      const resolved = resolver.resolve({
        pathname: "/bar",
        state: null,
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, remainingLocation: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(PathRouteRecord));
      expect(routeRecord.action(emptyMatch)).toBe("bar");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
    it("3", () => {
      const resolved = resolver.resolve({
        pathname: "/baz",
        state: null,
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, remainingLocation: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(PathRouteRecord));
      expect(routeRecord.action(emptyMatch)).toBe("baz.");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
    it("4", () => {
      const resolved = wildcardResolver.resolve({
        pathname: "/foo",
        state: {
          sta: "te",
        },
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, remainingLocation: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(PathRouteRecord));
      expect(routeRecord.action(emptyMatch)).toBe("foo!");
      expect(next).toEqual({
        pathname: "/",
        state: {
          sta: "te",
        },
      });
    });
  });
  describe("resolves deep location", () => {
    it("1", () => {
      const resolved = resolver.resolve({
        pathname: "/foo/hoge",
        state: {
          sta: "te",
        },
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, remainingLocation: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(PathRouteRecord));
      expect(routeRecord.action(emptyMatch)).toBe("hoge");
      expect(next).toEqual({
        pathname: "/",
        state: {
          sta: "te",
        },
      });
    });
    it("2", () => {
      const resolved = resolver.resolve({
        pathname: "/bar/fuga",
        state: null,
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, remainingLocation: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(PathRouteRecord));
      expect(routeRecord.action(emptyMatch)).toBe("fuga");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
    it("3", () => {
      const resolved = wildcardResolver.resolve({
        pathname: "/bar/fuga",
        state: null,
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, remainingLocation: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(PathRouteRecord));
      expect(routeRecord.action(emptyMatch)).toBe("fuga");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
    it("4", () => {
      const resolved = resolver.resolve({
        pathname: "/noaction/wow",
        state: null,
      });
      expect(resolved.length).toBe(1);
      const { route: routeRecord, remainingLocation: next } = resolved[0];
      expect(routeRecord).toEqual(expect.any(PathRouteRecord));
      expect(routeRecord.action(emptyMatch)).toBe("wow");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
  });
  describe("wrong location returns an empty array", () => {
    it("shallow nonexistent location", () => {
      const resolved = resolver.resolve({
        pathname: "/nonexistent",
        state: null,
      });
      expect(resolved).toEqual([]);
    });
    it("deep nonexistent location", () => {
      const resolved = resolver.resolve({
        pathname: "/foo/nonexistent",
        state: null,
      });
      expect(resolved).toEqual([]);
    });
    it("illegal location", () => {
      const resolved = resolver.resolve({
        pathname: "foo/bar",
        state: null,
      });
      expect(resolved).toEqual([]);
    });
  });

  describe("resolves wildcard location", () => {
    it("shallow", () => {
      const resolved = wildcardResolver.resolve({
        pathname: "/nonexistent",
        state: null,
      });
      expect(resolved).toEqual([
        {
          remainingLocation: {
            pathname: "/",
            state: null,
          },
          currentLocation: {
            pathname: "/nonexistent",
            state: null,
          },
          match: {
            id: "nonexistent",
          },
          route: expect.any(MatchingRouteRecord),
        },
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((resolved[0].route as any).key).toBe("id");
    });
  });

  describe("no-action route does not resolve", () => {
    it("no-action route", () => {
      const resolved = resolver.resolve({
        pathname: "/noaction",
        state: null,
      });
      expect(resolved).toEqual([]);
    });
  });
});
