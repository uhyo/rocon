import { createMemoryHistory } from "history";
import { HistoryRoutes } from "./";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let history: any;

beforeEach(() => {
  // mocked
  history = createMemoryHistory();
});

describe("HistoryRoutes", () => {
  it("empty", () => {
    const routes = HistoryRoutes.init({}, { history });
    expect(routes).toEqual({});
  });

  it("go without state", () => {
    const routes = HistoryRoutes.init(
      {
        foo: {
          action: () => ({
            pathname: "/foo",
          }),
        },
      },
      { history }
    );
    routes.foo.go();
    expect(history.push.mock.calls[0][0]).toEqual({
      pathname: "/foo",
    });
  });

  it("go with state", () => {
    const routes = HistoryRoutes.init(
      {
        foo: {
          action: (num: number) => ({
            pathname: `/foo`,
            state: {
              num,
            },
          }),
        },
      },
      { history }
    );
    routes.foo.go(123);
    expect(history.push.mock.calls).toEqual([
      [
        {
          pathname: "/foo",
        },
        {
          num: 123,
        },
      ],
    ]);
  });
});
