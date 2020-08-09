import { noop } from "../../util/noop";
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
   * Change the state of this link to attaching.
   */
  attaching() {
    this.#state = {
      state: "attaching",
    };
  }

  /**
   * Attach this link to a parent.
   */
  attachToParent(
    parentLink: BuilderLink<ActionResult, unknown, Value>,
    segmentGetter: (match: unknown) => Segment
  ) {
    const thisLink = this.followInheritanceChain(noop).last;
    if (
      thisLink.#state.state !== "unattached" &&
      thisLink.#state.state !== "attaching"
    ) {
      throw new Error("A builder cannot be attached more than once.");
    }
    thisLink.#state = {
      state: "attached",
      parentLink,
      segmentGetter,
    };

    thisLink.resolver = parentLink.resolver;
  }

  /**
   * Follow inheritance chain and run a function at the end.
   */
  private followInheritanceChain<Result>(
    callback: (link: BuilderLink<ActionResult, Segment, Value>) => Result
  ): {
    result: Result;
    last: BuilderLink<ActionResult, Segment, Value>;
  } {
    if (this.#state.state === "inherited") {
      const res = this.#state.inheritor.followInheritanceChain(callback);
      // short-cut optimization
      this.#state = {
        state: "inherited",
        inheritor: res.last,
      };
      return res;
    } else {
      const result = callback(this);
      return {
        result,
        last: this,
      };
    }
  }

  /**
   * Collect pairs of link and segment between its parent.
   */
  collectUpToTop(): Array<{
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
    return top.followInheritanceChain(noop).last;
  }

  checkInvalidation() {
    if (this.#state.state === "inherited") {
      throw new Error("This BuilderLink is already invalidated.");
    }
  }

  getParentLinkAndSegmentGetter():
    | [(match: unknown) => Segment, BuilderLink<ActionResult, Segment, Value>]
    | undefined {
    return this.followInheritanceChain<
      | [(match: unknown) => Segment, BuilderLink<ActionResult, Segment, Value>]
      | undefined
    >((link) => {
      const state = link.#state;
      if (state.state === "attached") {
        return [state.segmentGetter, state.parentLink];
      }
      return undefined;
    }).result;
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
    switch (this.#state.state) {
      case "unattached": {
        const result = new BuilderLink<ActionResult, Segment, Value>({
          composer: this.composer,
        });
        result.#state = this.#state;
        return result;
      }
      case "attaching": {
        const result = new BuilderLink<ActionResult, Segment, Value>({
          composer: this.composer,
        });
        result.#state = this.#state;
        this.#state = {
          state: "inherited",
          inheritor: result,
        };
        return result;
      }
      case "attached": {
        const result = new BuilderLink<ActionResult, Segment, Value>({
          composer: this.composer,
        });
        result.resolver = this.resolver;

        // this.#state.parentLink.attach(result);
        result.attachToParent(
          this.#state.parentLink,
          this.#state.segmentGetter
        );

        this.#state = {
          state: "inherited",
          inheritor: result,
        };
        return result;
      }
      case "inherited": {
        throw new Error("Cannot inherit already invalidated link");
      }
    }
  }
}
