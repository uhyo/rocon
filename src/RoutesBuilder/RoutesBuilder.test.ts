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

  it("RoutesBuilder is immutable", () => {
    const b1 = RoutesBuilder.init<string>().routes({
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

  it("State handling", () => {
    const res = RoutesBuilder.init<string>().routes({
      foo: {
        action: () => "foo!",
      },
      bar: {
        action: (num: number) => `bar? ${num}`,
      },
    });
    const routes = res.getRoutes();
    expect(Object.keys(routes)).toEqual(["foo", "bar"]);
    expect(routes.foo.action()).toEqual("foo!");
    expect(routes.bar.action(123)).toEqual("bar? 123");
  });
});
