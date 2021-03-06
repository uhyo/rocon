import { PathLocationComposer } from ".";

let composer!: PathLocationComposer;
beforeEach(() => {
  composer = new PathLocationComposer();
});

describe("PathLocationComposer", () => {
  describe("isLeaf", () => {
    describe("returns true for the root path", () => {
      it("1", () => {
        expect(
          composer.isLeaf({
            pathname: "/",
            state: null,
          })
        ).toBe(true);
      });
      it("2", () => {
        expect(
          composer.isLeaf({
            pathname: "/",
            search: "foo=bar",
            state: null,
          })
        ).toBe(true);
      });
      it("3", () => {
        expect(
          composer.isLeaf({
            pathname: "/",
            hash: "idid",
            state: {
              sta: "te",
            },
          })
        ).toBe(true);
      });
    });
    describe("returns false for non-root paths", () => {
      it("1", () => {
        expect(
          composer.isLeaf({
            pathname: "/foo",
            state: null,
          })
        );
      });
      it("2", () => {
        expect(
          composer.isLeaf({
            pathname: "/foo",
            search: "bar=quux",
            state: {
              sta: "te",
            },
          })
        );
      });
    });
  });
  describe("compose", () => {
    it("compose pathname", () => {
      expect(
        composer.compose(
          {
            pathname: "/",
            state: null,
          },
          "foo"
        )
      ).toEqual({
        pathname: "/foo",
        state: null,
      });
    });
    it("compose state", () => {
      expect(
        composer.compose(
          {
            pathname: "/foo",
            state: {
              num: 123,
            },
          },
          "bar"
        )
      ).toEqual({
        pathname: "/foo/bar",
        state: {
          num: 123,
        },
      });
    });
    it("compose aux", () => {
      expect(
        composer.compose(
          {
            pathname: "/foo",
            search: "?bar=1",
            hash: "#id",
            state: {
              num: 123,
            },
          },
          "/bar"
        )
      ).toEqual({
        pathname: "/foo/bar",
        search: "?bar=1",
        hash: "#id",
        state: {
          num: 123,
        },
      });
    });
  });
  describe("decompose", () => {
    describe("decompose pathname", () => {
      it("pathname", () => {
        expect(
          composer.decompose({
            pathname: "/foo/bar",
            state: null,
          })
        ).toEqual([
          {
            leaf: true,
            segment: undefined,
            nextLocation: {
              pathname: "/foo/bar",
              state: null,
            },
          },
          {
            leaf: false,
            segment: "foo",
            nextLocation: {
              pathname: "/bar",
              state: null,
            },
          },
        ]);
      });
      it("returns / for empty path", () => {
        expect(
          composer.decompose({
            pathname: "/foo",
            state: null,
          })
        ).toEqual([
          {
            leaf: true,
            segment: undefined,
            nextLocation: {
              pathname: "/foo",
              state: null,
            },
          },
          {
            leaf: false,
            segment: "foo",
            nextLocation: {
              pathname: "/",
              state: null,
            },
          },
        ]);
      });
      it("inherit search, hash and state", () => {
        expect(
          composer.decompose({
            pathname: "/foo/bar/baz",
            search: "q=abc",
            hash: "id1",
            state: {
              st: "ate",
            },
          })
        ).toEqual([
          {
            leaf: true,
            segment: undefined,
            nextLocation: {
              pathname: "/foo/bar/baz",
              search: "q=abc",
              hash: "id1",
              state: {
                st: "ate",
              },
            },
          },
          {
            leaf: false,
            segment: "foo",
            nextLocation: {
              pathname: "/bar/baz",
              search: "q=abc",
              hash: "id1",
              state: {
                st: "ate",
              },
            },
          },
        ]);
      });
    });
    describe("return only current for invalid path", () => {
      it("1", () => {
        expect(
          composer.decompose({
            pathname: "/",
            search: "q=abc",
            hash: "id1",
            state: {
              st: "ate",
            },
          })
        ).toEqual([
          {
            leaf: true,
            segment: undefined,
            nextLocation: {
              pathname: "/",
              search: "q=abc",
              hash: "id1",
              state: {
                st: "ate",
              },
            },
          },
        ]);
      });
      it("2", () => {
        expect(
          composer.decompose({
            pathname: "",
            state: {
              st: "ate",
            },
          })
        ).toEqual([
          {
            leaf: true,
            segment: undefined,
            nextLocation: {
              pathname: "",
              state: {
                st: "ate",
              },
            },
          },
        ]);
      });
      it("3", () => {
        expect(
          composer.decompose({
            pathname: "foo/bar",
            search: "q=abc",
            hash: "id1",
            state: null,
          })
        ).toEqual([
          {
            leaf: true,
            segment: undefined,
            nextLocation: {
              pathname: "foo/bar",
              search: "q=abc",
              hash: "id1",
              state: null,
            },
          },
        ]);
      });
    });
  });
});
