import { PathLocationComposer } from "./";

let composer!: PathLocationComposer<null>;
beforeEach(() => {
  composer = new PathLocationComposer({
    pathname: "/",
    state: null,
  });
});

describe("PathLocationComposer", () => {
  it("root", () => {
    expect(composer.getRoot()).toEqual({
      pathname: "/",
      state: null,
    });
  });
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
