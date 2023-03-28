import React, { forwardRef, Ref, useContext, useMemo } from "react";
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

export type LinkPropsWithRef<Match> = LinkProps<Match> & {
  ref?: Ref<HTMLAnchorElement | null>;
};

/**
 * Renders an <a> element to given route.
 */
const RawLink = <Match,>(
  { route, match, onClick, ...props }: LinkProps<Match>,
  ref: Ref<HTMLAnchorElement | null>
): ReactElement | null => {
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
      ref={ref}
      href={href}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
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

export const Link = forwardRef(RawLink) as <Match>(
  p: LinkPropsWithRef<Match>
) => ReactElement | null;

function isModifiedEvent(event: React.MouseEvent) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}
