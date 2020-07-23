import { PathRoutesBuilder } from "../RoutesBuilder/PathRoutesBuilder";

describe("Composed Location resolving", () => {
  describe("path-path", () => {
    it("1", () => {
      const builder = PathRoutesBuilder.init<string>().routes({
        foo: {
          action: () => "foo!",
        },
        bar: {},
      });
      const toplevel = builder.getRoutes();

      const sub1 = PathRoutesBuilder.attachTo(toplevel.foo)
        .routes({
          hoge: {
            action: () => "hoge.",
          },
        })
        .getRoutes();

      const sub2 = PathRoutesBuilder.attachTo(toplevel.bar)
        .routes({
          fuga: {
            action: () => "fuga!",
          },
        })
        .getRoutes();

      const resolver = builder.getResolver();
      const hogeResults = resolver.resolve({
        pathname: "/foo/hoge",
        state: null,
      });
      expect(hogeResults.length).toBe(1);
      const [hogeRoute] = hogeResults;
      expect(hogeRoute.route.action(hogeRoute.match)).toBe("hoge.");
    });
  });
});
