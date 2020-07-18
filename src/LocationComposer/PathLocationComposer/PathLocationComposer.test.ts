import { PathLocationComposer } from "./";

let composer!: PathLocationComposer;
beforeEach(() => {
  composer = new PathLocationComposer();
});

describe("PathLocationComposer", () => {
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
          [
            "foo",
            {
              pathname: "/bar",
              state: null,
            },
          ],
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
          [
            "foo",
            {
              pathname: "/bar/baz",
              search: "q=abc",
              hash: "id1",
              state: {
                st: "ate",
              },
            },
          ],
        ]);
      });
    });
    describe("return empty for invalid path", () => {
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
        ).toEqual([]);
      });
      it("2", () => {
        expect(
          composer.decompose({
            pathname: "",
            state: {
              st: "ate",
            },
          })
        ).toEqual([]);
      });
      it("3", () => {
        expect(
          composer.decompose({
            pathname: "foo/bar",
            search: "q=abc",
            hash: "id1",
            state: null,
          })
        ).toEqual([]);
      });
    });
  });
});
