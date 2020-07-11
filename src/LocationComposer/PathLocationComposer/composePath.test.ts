import { composePath } from "./composePath";

describe("composePath", () => {
  it("no slash slash", () => {
    expect(composePath("/foo", "/bar")).toBe("/foo/bar");
    expect(composePath("/foo", "/hoge/")).toBe("/foo/hoge/");
  });
  it("slash slash", () => {
    expect(composePath("/", "/bar")).toBe("/bar");
    expect(composePath("/foo/bar/", "/bar/")).toBe("/foo/bar/bar/");
  });
  it("no slash no slash", () => {
    expect(composePath("/foo", "bar")).toBe("/foo/bar");
    expect(composePath("/foo/bar", "bar/")).toBe("/foo/bar/bar/");
  });
  it("no slash slash", () => {
    expect(composePath("/foo", "/bar")).toBe("/foo/bar");
    expect(composePath("/foo/bar", "/bar/")).toBe("/foo/bar/bar/");
  });
});
