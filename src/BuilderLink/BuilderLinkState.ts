import type { BuilderLink } from ".";
import type { RouteRecordType } from "../RouteBuilder/RouteRecord";

/**
 * State of BuilderLink.
 * - unattached: this link is not attached to a parent.
 * - attached: this link is attached to a parent.
 * - inherited: another link inherited this one.
 */
export type BuilderLinkState<ActionResult, Segment> =
  | {
      state: "unattached";
      parentRoute?: undefined;
    }
  | {
      state: "attached";
      parentRoute: RouteRecordType<ActionResult, never, boolean>;
    }
  | {
      state: "inherited";
      parentRoute?: undefined;
      inheritor: BuilderLink<ActionResult, Segment>;
    };
