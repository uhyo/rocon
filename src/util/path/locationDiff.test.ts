import { Location } from "../../core/Location";
import { locationDiff } from "./locationDiff";

describe("pathname", () => {
  const base: Location = {
    pathname: "/pika",
    state: null,
  };

  it("Should return difference between base and location", () => {
    const location: Location = {
      pathname: "/pika/chu",
      state: null,
    };
    expect(locationDiff(base, location)).toEqual({
      pathname: "/chu",
      state: null,
    });
  });
  it("should return / if the pathnames are equal", () => {
    const location: Location = {
      pathname: "/pika",
      state: null,
    };
    expect(locationDiff(base, location)).toEqual({
      pathname: "/",
      state: null,
    });
  });
  it("should return undefined if the pathnames are different", () => {
    const location: Location = {
      pathname: "/mario",
      state: null,
    };
    expect(locationDiff(base, location)).toBeUndefined();
  });
  it("should return undefined if the pathnames are reverse suffix", () => {
    const location: Location = {
      pathname: "/",
      state: null,
    };
    expect(locationDiff(base, location)).toBeUndefined();
  });
  it("should ignore trailing slashes", () => {
    const location: Location = {
      pathname: "/pika/",
      state: null,
    };
    expect(locationDiff(base, location)).toEqual({
      pathname: "/",
      state: null,
    });
  });
  it("should ignore trailing slashes 2", () => {
    const location: Location = {
      pathname: "/pika",
      state: null,
    };
    expect(
      locationDiff(
        {
          pathname: "/pika/",
          state: null,
        },
        location
      )
    ).toEqual({
      pathname: "/",
      state: null,
    });
  });
});

describe("search", () => {
  const base: Location = {
    pathname: "/pika",
    search: "?foo=bar",
    state: null,
  };

  it("Should return difference between base and location", () => {
    const location: Location = {
      pathname: "/pika",
      search: "?foo=bar&baz=qux",
      state: null,
    };
    expect(locationDiff(base, location)).toEqual({
      pathname: "/",
      search: "?baz=qux",
      state: null,
    });
  });
  it("Search should be empty if the search is equal", () => {
    const location: Location = {
      pathname: "/pika",
      search: "?foo=bar",
      state: null,
    };
    expect(locationDiff(base, location)).toEqual({
      pathname: "/",
      search: "",
      state: null,
    });
  });
  it("should return undefined if the pathnames are different", () => {
    const location: Location = {
      pathname: "/pika",
      search: "?foo=pika",
      state: null,
    };
    expect(locationDiff(base, location)).toBeUndefined();
  });
});

describe("state", () => {
  const base: Location = {
    pathname: "/pika",
    state: {
      foo: "bar",
    },
  };

  it("Should return difference between base and location", () => {
    const location: Location = {
      pathname: "/pika",
      state: {
        foo: "bar",
        baz: "qux",
      },
    };
    expect(locationDiff(base, location)).toEqual({
      pathname: "/",
      state: {
        baz: "qux",
      },
    });
  });
  it("State should be empty if the state is equal", () => {
    const location: Location = {
      pathname: "/pika",
      state: {
        foo: "bar",
      },
    };
    expect(locationDiff(base, location)).toEqual({
      pathname: "/",
      state: {},
    });
  });
  it("should return undefined if the pathnames are different", () => {
    const location: Location = {
      pathname: "/pika",
      state: {
        foo: "pika",
      },
    };
    expect(locationDiff(base, location)).toBeUndefined();
  });
});
