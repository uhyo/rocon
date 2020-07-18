import { RouteResolver } from ".";
import { PathLocationComposer } from "../LocationComposer/PathLocationComposer";
import { RoutesBuilder } from "../RoutesBuilder";
import { RouteRecord } from "../RoutesBuilder/RouteRecord";

const composer = new PathLocationComposer();

const routes = RoutesBuilder.init<string>({
  composer,
})
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
  })
  .getRoutes();

routes.foo.attach(
  RoutesBuilder.init<string>({ composer }).routes({
    hoge: {
      action: () => "hoge",
    },
  })
);

routes.bar.attach(
  RoutesBuilder.init<string>({ composer }).routes({
    fuga: {
      action: () => "fuga",
    },
  })
);

const resolver = new RouteResolver<string, typeof routes>(routes, composer);

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
      const [routeRecord, next] = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action()).toBe("foo!");
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
      const [routeRecord, next] = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action()).toBe("bar");
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
      const [routeRecord, next] = resolved[0];
      expect(routeRecord).toEqual(expect.any(RouteRecord));
      expect(routeRecord.action()).toBe("baz.");
      expect(next).toEqual({
        pathname: "/",
        state: null,
      });
    });
  });
  it("wrong location returns an empty array", () => {
    const resolved = resolver.resolve({
      pathname: "/nonexistent",
      state: null,
    });
    expect(resolved).toEqual([]);
  });
});
