import { SearchLocationComposer } from ".";

describe("SearchLocationComposer", () => {
  describe("isLeaf", () => {
    it("passing nothing returns true", () => {
      const composer = new SearchLocationComposer("k", false);

      expect(
        composer.isLeaf({
          pathname: "/pathname",
          state: null,
        })
      ).toBe(true);
    });
    it("passing empty returns true", () => {
      const composer = new SearchLocationComposer("k", false);

      expect(
        composer.isLeaf({
          pathname: "/pathname",
          search: "",
          state: null,
        })
      ).toBe(true);
    });
    it("passing some pair returns false", () => {
      const composer = new SearchLocationComposer("k", false);

      expect(
        composer.isLeaf({
          pathname: "/pathname",
          search: "foo=bar",
          state: null,
        })
      ).toBe(false);
    });
    it("passing empty valued key returns false", () => {
      const composer = new SearchLocationComposer("k", false);

      expect(
        composer.isLeaf({
          pathname: "/pathname",
          search: "foo=",
          state: null,
        })
      ).toBe(false);
    });
  });
  describe("compose", () => {
    it("composes from nothing", () => {
      const composer = new SearchLocationComposer("k", false);

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
        search: "k=hi",
        state: {
          sta: "te",
        },
      });
    });
    it("composes from empty", () => {
      const composer = new SearchLocationComposer("wow", false);

      expect(
        composer.compose(
          {
            pathname: "/",
            search: "",
            state: null,
          },
          "hi"
        )
      ).toEqual({
        pathname: "/",
        search: "wow=hi",
        state: null,
      });
    });
    it("add new key", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.compose(
          {
            pathname: "/",
            search: "wow=hi&foo=%E3%81%82%E3%81%84%E3%81%86",
            state: null,
          },
          "value"
        )
      ).toEqual({
        pathname: "/",
        search: "wow=hi&foo=%E3%81%82%E3%81%84%E3%81%86&key=value",
        state: null,
      });
    });
    it("override existing key", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.compose(
          {
            pathname: "/",
            search: "wow=hi&key=1234",
            state: null,
          },
          "value"
        )
      ).toEqual({
        pathname: "/",
        search: "wow=hi&key=value",
        state: null,
      });
    });
    it("percent-encoding", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.compose(
          {
            pathname: "/",
            state: null,
          },
          "あいう"
        )
      ).toEqual({
        pathname: "/",
        search: "key=%E3%81%82%E3%81%84%E3%81%86",
        state: null,
      });
    });
    it("empty value", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.compose(
          {
            pathname: "/",
            search: "foo=bar",
            state: null,
          },
          ""
        )
      ).toEqual({
        pathname: "/",
        search: "foo=bar&key=",
        state: null,
      });
    });
    it("optional accepts nothing and does no change", () => {
      const composer = new SearchLocationComposer("key", true);

      expect(
        composer.compose(
          {
            pathname: "/",
            search: "foo=bar",
            state: null,
          },
          undefined
        )
      ).toEqual({
        pathname: "/",
        search: "foo=bar",
        state: null,
      });
    });
  });

  describe("decompose", () => {
    it("extracts existing key", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.decompose({
          pathname: "/",
          search: "wow=hi&key=1234",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: "1234",
          nextLocation: {
            pathname: "/",
            search: "wow=hi",
            state: null,
          },
        },
      ]);
    });
    it("extracts first key", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.decompose({
          pathname: "/",
          search: "key=123&wow=hi&key=456",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: "123",
          nextLocation: {
            pathname: "/",
            search: "wow=hi",
            state: null,
          },
        },
      ]);
    });
    it("empty string if exhausted", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.decompose({
          pathname: "/",
          search: "key=value",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: "value",
          nextLocation: {
            pathname: "/",
            search: "",
            state: null,
          },
        },
      ]);
    });
    it("decodes percent-encoded string", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.decompose({
          pathname: "/",
          search: "wow=hi&key=%E3%81%82%E3%81%84%E3%81%86",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: "あいう",
          nextLocation: {
            pathname: "/",
            search: "wow=hi",
            state: null,
          },
        },
      ]);
    });
    it("decodes empty value", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.decompose({
          pathname: "/",
          search: "key=",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: "",
          nextLocation: {
            pathname: "/",
            search: "",
            state: null,
          },
        },
      ]);
    });
    it("decodes name-only value", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.decompose({
          pathname: "/",
          search: "key&foo=bar",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: "",
          nextLocation: {
            pathname: "/",
            search: "foo=bar",
            state: null,
          },
        },
      ]);
    });
    it("returns empty if no key", () => {
      const composer = new SearchLocationComposer("key", false);

      expect(
        composer.decompose({
          pathname: "/",
          search: "wow=hi",
          state: null,
        })
      ).toEqual([]);
    });
    it("optional: returns undefined if no key", () => {
      const composer = new SearchLocationComposer("key", true);

      expect(
        composer.decompose({
          pathname: "/",
          search: "wow=hi",
          state: null,
        })
      ).toEqual([
        {
          leaf: false,
          segment: undefined,
          nextLocation: {
            pathname: "/",
            search: "wow=hi",
            state: null,
          },
        },
      ]);
    });
  });
});
