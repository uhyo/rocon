import { RoutesBuilder } from "./";

describe("RoutesBuilder", () => {
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
    expect(routes.bar.action()).toEqual("bar?");
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
    expect(routes.bar.action()).toEqual("bar?");
  });
});
