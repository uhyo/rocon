import type { RouteRecordType } from "../../builder/RouteRecord";
import { routeRecordParentKey } from "../../builder/symbols";
import type { LocationComposer } from "../LocationComposer";
import { RouteResolver, SegmentResolver } from "../RouteResolver";
import { HasBuilderLink } from "./AttachableRouteBuilder";
import type { BuilderLinkOptions } from "./BuilderLinkOptions";
import { BuilderLinkState } from "./BuilderLinkState";

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
  resolveSegment?: SegmentResolver<
    ActionResult,
    Segment,
    RouteRecordType<ActionResult, never, boolean>
  >;

  constructor(options: BuilderLinkOptions<Segment>) {
    this.composer = options.composer;
    this.resolver = new RouteResolver(this);
  }

  /**
   * Attach this link to a parent.
   */
  attachToParent(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentRoute: RouteRecordType<any, any, any>,
    // TODO: remove parentRoute in favor of parentLink
    parentLink: BuilderLink<ActionResult, unknown, Value> = parentRoute[
      routeRecordParentKey
    ]
  ) {
    if (this.#state.state !== "unattached") {
      throw new Error("A builder cannot be attached more than once.");
    }
    this.#state = {
      state: "attached",
      parentRoute,
    };
    // TODO: what if it already has a child link?
    switch (parentLink.#state.state) {
      case "unattached": {
        parentLink.#state = {
          ...parentLink.#state,
        };
        break;
      }
      case "attached": {
        parentLink.#state = {
          ...parentLink.#state,
        };
        break;
      }
      case "inherited": {
        parentLink.checkInvalidation();
        break;
      }
    }

    this.resolver = parentLink.resolver;
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

  checkInvalidation() {
    if (this.#state.state === "inherited") {
      throw new Error("This BuilderLink is already invalidated.");
    }
  }

  getParentRoute(): RouteRecordType<ActionResult, never, boolean> | undefined {
    return this.followInheritanceChain((link) => link.#state.parentRoute)
      .result;
  }

  getBuilderLink(): this {
    return this;
  }

  // getCurrentBuilder():
  //   | AttachableRouteBuilder<ActionResult, Segment>
  //   | undefined {
  //   return this.currentBuilder;
  // }

  /**
   * TODO: rethink
   */
  register(
    builder: HasBuilderLink<ActionResult, Segment, Value>,
    resolveSegment: SegmentResolver<
      ActionResult,
      Segment,
      RouteRecordType<ActionResult, never, boolean>
    >
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
      case "attached": {
        const result = new BuilderLink<ActionResult, Segment, Value>({
          composer: this.composer,
        });
        result.resolver = this.resolver;

        this.#state.parentRoute.attach(result);

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
