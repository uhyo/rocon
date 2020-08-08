import { StateLocationComposer } from ".";

const isNumber = (value: unknown): value is number => typeof value === "number";
const isString = (value: unknown): value is string => typeof value === "string";
describe("StateLocationComposer", () => {
  describe("isLeaf", () => {
    it("null is leaf", () => {
      const composer = new StateLocationComposer("key", isNumber, false);

      expect(
        composer.isLeaf({
          pathname: "/",
          state: null,
        })
      ).toBe(true);
    });
    it("nonexisting value is leaf", () => {
      const composer = new StateLocationComposer("key", isNumber, false);

      expect(
        composer.isLeaf({
          pathname: "/",
          state: {},
        })
      ).toBe(true);
    });
    it("undefined value is leaf", () => {
      const composer = new StateLocationComposer("key", isNumber, false);

      expect(
        composer.isLeaf({
          pathname: "/",
          state: {
            key: undefined,
          },
        })
      ).toBe(true);
    });
    it("null value is not leaf", () => {
      const composer = new StateLocationComposer("key", isNumber, false);

      expect(
        composer.isLeaf({
          pathname: "/",
          state: {
            key: null,
          },
        })
      ).toBe(false);
    });
    it("other value is not leaf", () => {
      const composer = new StateLocationComposer("key", isNumber, false);

      expect(
        composer.isLeaf({
          pathname: "/",
          state: {
            key: 123,
          },
        })
      ).toBe(false);
    });
  });

  describe("compose", () => {
    it("compose from empty", () => {
      const composer = new StateLocationComposer("key", isNumber, false);
      expect(
        composer.compose(
          {
            pathname: "/",
            search: "foo=bar",
            state: null,
          },
          12345
        )
      ).toEqual({
        pathname: "/",
        search: "foo=bar",
        state: {
          key: 12345,
        },
      });
    });
    it("add key", () => {
      const composer = new StateLocationComposer("key", isNumber, false);
      expect(
        composer.compose(
          {
            pathname: "/",
            state: {
              foo: "bar",
            },
          },
          9999
        )
      ).toEqual({
        pathname: "/",
        state: {
          foo: "bar",
          key: 9999,
        },
      });
    });
    it("override key", () => {
      const composer = new StateLocationComposer("key", isNumber, false);
      expect(
        composer.compose(
          {
            pathname: "/",
            state: {
              key: 0,
            },
          },
          9876
        )
      ).toEqual({
        pathname: "/",
        state: {
          key: 9876,
        },
      });
    });
  });

  describe("decompose", () => {
    it("empty returns empty", () => {
      const composer = new StateLocationComposer("key", isNumber, false);
      expect(
        composer.decompose({
          pathname: "/",
          state: null,
        })
      ).toEqual([]);
    });
    it("undefined returns empty", () => {
      const composer = new StateLocationComposer("key", isNumber, false);
      expect(
        composer.decompose({
          pathname: "/",
          state: {
            foo: 4444,
            key: undefined,
          },
        })
      ).toEqual([]);
    });
    it("nonexisting key returns empty", () => {
      const composer = new StateLocationComposer("key", isNumber, false);
      expect(
        composer.decompose({
          pathname: "/",
          state: {
            foo: 4444,
          },
        })
      ).toEqual([]);
    });
    it("invalid value returns empty", () => {
      const composer = new StateLocationComposer("key", isNumber, false);
      expect(
        composer.decompose({
          pathname: "/",
          state: {
            key: "555",
          },
        })
      ).toEqual([]);
    });
    it("removes key from state", () => {
      const composer = new StateLocationComposer("key", isNumber, false);
      expect(
        composer.decompose({
          pathname: "/",
          search: "foo=bar",
          state: {
            hoge: "あいう",
            key: 1234,
          },
        })
      ).toEqual([
        {
          leaf: false,
          segment: 1234,
          nextLocation: {
            pathname: "/",
            search: "foo=bar",
            state: {
              hoge: "あいう",
            },
          },
        },
      ]);
    });
    it("optional: segment is undefined for null state", () => {
      const composer = new StateLocationComposer("key", isNumber, true);
      expect(
        composer.decompose({
          pathname: "/",
          search: "foo=bar",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: undefined,
          nextLocation: {
            pathname: "/",
            search: "foo=bar",
            state: null,
          },
        },
      ]);
    });
    it("optional: segment is undefined for nonexisting state", () => {
      const composer = new StateLocationComposer("key", isNumber, true);
      expect(
        composer.decompose({
          pathname: "/",
          search: "foo=bar",
          state: {},
        })
      ).toEqual([
        {
          leaf: false,
          segment: undefined,
          nextLocation: {
            pathname: "/",
            search: "foo=bar",
            state: {},
          },
        },
      ]);
    });
    it("optional: still no result for invalid state value", () => {
      const composer = new StateLocationComposer("key", isNumber, true);
      expect(
        composer.decompose({
          pathname: "/",
          search: "foo=bar",
          state: {
            key: "foobar",
          },
        })
      ).toEqual([]);
    });
  });
});
