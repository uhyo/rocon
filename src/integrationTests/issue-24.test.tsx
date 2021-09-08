import { createMemoryHistory } from "history";
import React, { useEffect } from "react";
import Rocon, { useNavigate, useRoutes } from "../react";
import { renderInHistory, screen } from "../react/test-utils";

const route = Rocon.Path()
  .exact({ action: () => <div>The root page</div> })
  .route("about", (route) => route.action(() => <About />));

function App() {
  return useRoutes(route);
}

const About: React.VFC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(route.exactRoute);
  }, [navigate]);

  return <div>The about page</div>;
};

it("use of navigate in useEffect", () => {
  // https://github.com/uhyo/rocon/issues/24
  const history = createMemoryHistory({
    initialEntries: [
      {
        pathname: "/about",
        state: null,
      },
    ],
  });
  renderInHistory(history, <App />);
  // useEffect should navigate to the root
  expect(history.location).toMatchObject({
    pathname: "/",
    state: null,
  });
  expect(screen.queryByText("The root page")).toBeInTheDocument();
});
