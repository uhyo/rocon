import type { BuilderLink } from ".";

/**
 * State of BuilderLink.
 * - unattached: this link is not attached to a parent.
 * - attaching: this link is about to be attached to a parent.
 * - attached: this link is attached to a parent.
 * - inherited: another link inherited this one.
 */
export type BuilderLinkState<ActionResult, Segment, Value> =
  | {
      state: "unattached";
      parentLink?: undefined;
    }
  | {
      state: "attaching";
      parentLink?: undefined;
    }
  | {
      state: "attached";
      parentLink: BuilderLink<ActionResult, Segment, Value>;
      segmentGetter: (match: unknown) => Segment;
    };
