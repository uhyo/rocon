import type { LocationComposer } from "../../LocationComposer";
import type { RouteRecordType } from "../../RouteBuilder/RouteRecord";
import { routeRecordParentKey } from "../../RouteBuilder/symbols";
import { RouteResolver, SegmentResolver } from "../RouteResolver";
import {
  AttachableRouteBuilder,
  HasBuilderLink,
} from "./AttachableRouteBuilder";
import type { BuilderLinkOptions } from "./BuilderLinkOptions";
import { BuilderLinkState } from "./BuilderLinkState";

export type RouteRecordsBase<ActionResult> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteRecordType<ActionResult, any, any>
>;

/**
 * Link between parent and child builders.
 */
export class BuilderLink<ActionResult, Segment>
  implements HasBuilderLink<ActionResult, Segment> {
  static init<ActionResult, Segment>(
    options: BuilderLinkOptions<Segment>
  ): BuilderLink<ActionResult, Segment> {
    return new BuilderLink<ActionResult, Segment>(options);
  }

  readonly composer: LocationComposer<Segment>;
  resolver: RouteResolver<ActionResult, Segment>;

  #state: BuilderLinkState<ActionResult, Segment> = {
    state: "unattached",
  };
  /**
   * Registered child builder.
   */
  #childBuilder?: AttachableRouteBuilder<ActionResult, Segment> = undefined;
  resolveSegment?: SegmentResolver<ActionResult, Segment>;

  private constructor(options: BuilderLinkOptions<Segment>) {
    this.composer = options.composer;
    this.resolver = new RouteResolver(this);
  }

  /**
   * Attach this link to a parent.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachToParent(parentRoute: RouteRecordType<any, any, any>) {
    if (this.#state.state !== "unattached") {
      throw new Error("A builder cannot be attached more than once.");
    }
    this.#state = {
      state: "attached",
      parentRoute,
    };

    this.resolver = parentRoute[routeRecordParentKey].resolver;
  }

  /**
   * Follow inheritance chain and run a function at the end.
   */
  private followInheritanceChain<Result>(
    callback: (link: BuilderLink<ActionResult, Segment>) => Result
  ): {
    result: Result;
    last: BuilderLink<ActionResult, Segment>;
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

  getChildBuilder(): AttachableRouteBuilder<ActionResult, Segment> | undefined {
    return this.#childBuilder;
  }

  /**
   * TODO: rethink
   */
  register(
    builder: AttachableRouteBuilder<ActionResult, Segment>,
    resolveSegment: SegmentResolver<ActionResult, Segment>
  ): void {
    this.#childBuilder = builder;
    this.resolveSegment = resolveSegment;
  }

  /**
   * Create a new BuilderLink which inherits current link.
   */
  inherit(): BuilderLink<ActionResult, Segment> {
    switch (this.#state.state) {
      case "unattached": {
        const result = new BuilderLink<ActionResult, Segment>({
          composer: this.composer,
        });
        result.#state = this.#state;
        return result;
      }
      case "attached": {
        const result = new BuilderLink<ActionResult, Segment>({
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
