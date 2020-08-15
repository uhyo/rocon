import React, { useContext, useMemo } from "react";
import { getRouteRecordLocation } from "../../builder/RouteRecord/getRouteRecordLocation";
import { locationToURL } from "../../util/locationToURL";
import { RouteContext } from "../contexts/RouteContext";
import { useNavigate } from "../hooks/useNavigate";
import { getNavigationBaseLocation } from "../logic/getNavigationBaseLocation";
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
  const parentRoute = useContext(RouteContext);
  const navigate = useNavigate();
  const href = useMemo(() => {
    const baseLocation = getNavigationBaseLocation(parentRoute, route);
    const location = getRouteRecordLocation(
      route,
      (match || {}) as Match,
      baseLocation
    );
    return locationToURL(location);
  }, [route, match, parentRoute]);
  return (
    <a
      href={href}
      onClick={(e) => {
        if (!isModifiedEvent(e)) {
          e.preventDefault();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (navigate as any)(route, match);
        }
      }}
      {...props}
    />
  );
};

function isModifiedEvent(event: React.MouseEvent) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}
