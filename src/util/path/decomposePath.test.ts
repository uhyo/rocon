import { decomposePath } from "./decomposePath";

describe("decomposePath", () => {
  describe("returns undefined for invalid path", () => {
    it("1", () => {
      expect(decomposePath("")).toBe(undefined);
    });
    it("2", () => {
      expect(decomposePath("foo")).toBe(undefined);
    });
    it("3", () => {
      expect(decomposePath("foo/bar")).toBe(undefined);
    });
  });
  it("returns undefined for root path", () => {
    expect(decomposePath("/")).toBe(undefined);
  });
  describe("returns top-level segment", () => {
    it("1", () => {
      expect(decomposePath("/foo")).toEqual(["foo", ""]);
    });
    it("2", () => {
      expect(decomposePath("/foo/")).toEqual(["foo", "/"]);
    });
    it("3", () => {
      expect(decomposePath("/foo/bar")).toEqual(["foo", "/bar"]);
    });
    it("4", () => {
      expect(decomposePath("/foo/bar/")).toEqual(["foo", "/bar/"]);
    });
    it("5", () => {
      expect(decomposePath("/foo/bar/baz")).toEqual(["foo", "/bar/baz"]);
    });
  });
});
