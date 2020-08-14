import { SingleHashLocationComposer } from ".";

describe("SingleHashLocationComposer", () => {
  describe("isLeaf", () => {
    it("passing nothing returns true", () => {
      const composer = new SingleHashLocationComposer(false);

      expect(
        composer.isLeaf({
          pathname: "/pathname",
          state: null,
        })
      ).toBe(true);
    });
    it("passing empty returns true", () => {
      const composer = new SingleHashLocationComposer(false);

      expect(
        composer.isLeaf({
          pathname: "/pathname",
          hash: "",
          state: null,
        })
      ).toBe(true);
    });
    it("passing some string returns false", () => {
      const composer = new SingleHashLocationComposer(false);

      expect(
        composer.isLeaf({
          pathname: "/pathname",
          hash: "#something",
          state: null,
        })
      ).toBe(false);
    });
  });
  describe("compose", () => {
    it("composes from nothing", () => {
      const composer = new SingleHashLocationComposer(false);

      expect(
        composer.compose(
          {
            pathname: "/",
            state: {
              sta: "te",
            },
          },
          "hi"
        )
      ).toEqual({
        pathname: "/",
        hash: "#hi",
        state: {
          sta: "te",
        },
      });
    });
    it("composes from empty", () => {
      const composer = new SingleHashLocationComposer(true);

      expect(
        composer.compose(
          {
            pathname: "/",
            hash: "",
            state: null,
          },
          "hi"
        )
      ).toEqual({
        pathname: "/",
        hash: "#hi",
        state: null,
      });
    });
    it("override current value", () => {
      const composer = new SingleHashLocationComposer(false);

      expect(
        composer.compose(
          {
            pathname: "/",
            hash: "#hi",
            state: null,
          },
          "idid"
        )
      ).toEqual({
        pathname: "/",
        hash: "#idid",
        state: null,
      });
    });
    it("empty value", () => {
      const composer = new SingleHashLocationComposer(false);

      expect(
        composer.compose(
          {
            pathname: "/",
            hash: "foo",
            state: null,
          },
          ""
        )
      ).toEqual({
        pathname: "/",
        hash: "#",
        state: null,
      });
    });
    it("optional accepts nothing and emits empty", () => {
      const composer = new SingleHashLocationComposer(true);

      expect(
        composer.compose(
          {
            pathname: "/",
            hash: "#hi",
            state: null,
          },
          undefined
        )
      ).toEqual({
        pathname: "/",
        hash: "",
        state: null,
      });
    });
  });

  describe("decompose", () => {
    it("extracts current value", () => {
      const composer = new SingleHashLocationComposer(false);

      expect(
        composer.decompose({
          pathname: "/",
          hash: "#hi",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: "hi",
          nextLocation: {
            pathname: "/",
            hash: "",
            state: null,
          },
        },
      ]);
    });
    it("hash-only value resolves to empty", () => {
      const composer = new SingleHashLocationComposer(false);

      expect(
        composer.decompose({
          pathname: "/",
          hash: "#",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: "",
          nextLocation: {
            pathname: "/",
            hash: "",
            state: null,
          },
        },
      ]);
    });
    it("empty value does not resolve if not optional", () => {
      const composer = new SingleHashLocationComposer(false);

      expect(
        composer.decompose({
          pathname: "/",
          hash: "",
          state: null,
        })
      ).toEqual([]);
    });
    it("optional: returns undefined if no value", () => {
      const composer = new SingleHashLocationComposer(true);

      expect(
        composer.decompose({
          pathname: "/",
          hash: "",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: undefined,
          nextLocation: {
            pathname: "/",
            hash: "",
            state: null,
          },
        },
      ]);
    });
  });
});
