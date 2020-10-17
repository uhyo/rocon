import { useLayoutEffect } from "react";
import { useNavigate } from "../hooks/useNavigate";
import { ReactRouteRecord } from "../types/ReactElement";

export type RedirectProps<Match> = {
  route: ReactRouteRecord<Match>;
} & ({} extends Match ? { match?: Match } : { match: Match });

/**
 * Redirects to given route.
 */
export const Redirect = <Match,>({
  route,
  match,
}: RedirectProps<Match>): null => {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigate.replace as any)(route, match);
  });
  return null;
};
