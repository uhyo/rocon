import type { History } from "history";

const createMockHistory = (): History => {
  return ({
    push: jest.fn(),
  } as unknown) as History;
};

export const createMemoryHistory = createMockHistory;
export const createHashHistory = createMockHistory;
export const createBrowserHistory = createMockHistory;
