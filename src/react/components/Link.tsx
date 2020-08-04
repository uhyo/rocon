import React from "react";
import { locationToURL } from "../../util/locationToURL";
import { useNavigate } from "../hooks/useNavigate";
import { ReactElement, ReactRouteRecord } from "../types/ReactElement";

export type LinkProps<Match> = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  route: ReactRouteRecord<Match>;
} & ({} extends Match ? { match?: Match } : { match: Match });

/**
 * Renders an <a> element to given route.
 */
export const Link = <Match,>({
  route,
  match,
  ...props
}: LinkProps<Match>): ReactElement | null => {
  const location = route.getLocation(match as Match);
  const navigate = useNavigate();
  return (
    <a
      href={locationToURL(location)}
      onClick={(e) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigate as any)(route, match);
      }}
      {...props}
    />
  );
};
