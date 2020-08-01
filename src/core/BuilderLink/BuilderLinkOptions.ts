import type { LocationComposer } from "../../LocationComposer";

export type BuilderLinkOptions<Segment> = {
  /**
   * LocationComposer for composing children paths.
   */
  composer: LocationComposer<Segment>;
};
