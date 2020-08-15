import { Location } from "../Location";
import type { LocationComposer } from "../LocationComposer";
import { RouteResolver } from "../RouteResolver";
import type { BuilderLinkOptions } from "./BuilderLinkOptions";
import { BuilderLinkState } from "./BuilderLinkState";
import { HasBuilderLink } from "./HasBuilderLink";
import { SegmentResolver } from "./SegmentResolver";

/**
 * Link between parent and child builders.
 */
export class BuilderLink<ActionResult, Segment, Value>
  implements HasBuilderLink<ActionResult, Segment, Value> {
  readonly composer: LocationComposer<Segment>;
  resolver: RouteResolver<ActionResult, Segment, Value>;

  #state: BuilderLinkState<ActionResult, Segment, Value> = {
    state: "unattached",
  };
  /**
   * Registered current builder.
   */
  currentBuilder?: HasBuilderLink<ActionResult, Segment, Value> = undefined;
  resolveSegment?: SegmentResolver<ActionResult, Segment, Value>;

  constructor(options: BuilderLinkOptions<Segment>) {
    this.composer = options.composer;
    this.resolver = new RouteResolver(this);
  }

  /**
   * Attach this link to a parent.
   */
  attachToParent(
    parentLink: BuilderLink<ActionResult, unknown, Value>,
    segmentGetter: (match: unknown) => Segment
  ) {
    if (this.#state.state !== "unattached") {
      throw new Error("A builder cannot be attached more than once.");
    }
    this.#state = {
      state: "attached",
      parentLink,
      segmentGetter,
    };

    this.resolver = parentLink.resolver;
  }

  /**
   * Collect pairs of link and segment between its parent.
   */
  private collectUpToTop(): Array<{
    link: BuilderLink<ActionResult, unknown, Value>;
    segmentGetter: (match: unknown) => unknown;
  }> {
    const result: Array<{
      link: BuilderLink<ActionResult, unknown, Value>;
      segmentGetter: (match: unknown) => unknown;
    }> = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: BuilderLink<ActionResult, unknown, Value> = this;
    let parent:
      | [(match: unknown) => unknown, BuilderLink<ActionResult, unknown, Value>]
      | undefined = current.getParentLinkAndSegmentGetter();
    while (parent !== undefined) {
      result.push({
        link: parent[1],
        segmentGetter: parent[0],
      });
      current = parent[1];
      parent = current.getParentLinkAndSegmentGetter();
    }
    return result;
  }

  composeFromTop(defaultRoot: Location, match: unknown): Location {
    const links = this.collectUpToTop().reverse();
    return links.reduce((loc, { link, segmentGetter: segment }) => {
      return link.composer.compose(loc, segment(match));
    }, defaultRoot);
  }

  /**
   * Returns the topmost and uninherited link.
   */
  getAttachmentRoot(): BuilderLink<ActionResult, unknown, Value> {
    const ls = this.collectUpToTop();
    const top = ls.length === 0 ? this : ls[ls.length - 1].link;
    return top;
  }

  getParentLinkAndSegmentGetter():
    | [(match: unknown) => Segment, BuilderLink<ActionResult, Segment, Value>]
    | undefined {
    const state = this.#state;
    if (state.state === "attached") {
      return [state.segmentGetter, state.parentLink];
    }
    return undefined;
  }

  getBuilderLink(): this {
    return this;
  }

  register(
    builder: HasBuilderLink<ActionResult, Segment, Value>,
    resolveSegment: SegmentResolver<ActionResult, Segment, Value>
  ): void {
    this.currentBuilder = builder;
    this.resolveSegment = resolveSegment;
  }

  /**
   * Create a new BuilderLink which inherits current link.
   */
  inherit(): BuilderLink<ActionResult, Segment, Value> {
    return this;
  }
}
