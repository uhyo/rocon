import { locationToURL } from "./locationToURL";
describe("locationToURL", () => {
  it("pathname only", () => {
    expect(
      locationToURL({
        pathname: "/foo/bar",
        state: null,
      })
    ).toBe("/foo/bar");
  });
  it("pathname + search", () => {
    expect(
      locationToURL({
        pathname: "/foo/bar",
        search: "key=value&foo=123",
        state: null,
      })
    ).toBe("/foo/bar?key=value&foo=123");
  });
  it("pathname + hash", () => {
    expect(
      locationToURL({
        pathname: "/foo/bar",
        hash: "idid",
        state: null,
      })
    ).toBe("/foo/bar#idid");
  });
  it("pathname + search + hash", () => {
    expect(
      locationToURL({
        pathname: "/foo/bar",
        search: "key=value&foo=123",
        hash: "idid",
        state: null,
      })
    ).toBe("/foo/bar?key=value&foo=123#idid");
  });
});
