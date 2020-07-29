import type { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import { RouteResolver, SegmentResolver } from "../RouteResolver";
import type { RouteRecordType } from "../RoutesBuilder/RouteRecord";
import { PartiallyPartial } from "../util/types/PartiallyPartial";
import {
  AttachableRoutesBuilder,
  HasBuilderLink,
} from "./AttachableRoutesBuilder";
import type { BuilderLinkOptions } from "./BuilderLinkOptions";
import { BuilderLinkState } from "./BuilderLinkState";
import { fillOptions } from "./fillOptions";

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
    options: PartiallyPartial<BuilderLinkOptions<ActionResult, Segment>, "root">
  ): BuilderLink<ActionResult, Segment> {
    fillOptions(options);
    return new BuilderLink<ActionResult, Segment>(options);
  }

  #state: BuilderLinkState<ActionResult, Segment> = {
    state: "unattached",
  };
  /**
   * Registered child builder.
   */
  #childBuilder?: AttachableRoutesBuilder<ActionResult, Segment> = undefined;
  // TODO: want to remove this one
  readonly composer: LocationComposer<Segment>;
  #rootLocation: Location;

  private constructor(options: BuilderLinkOptions<ActionResult, Segment>) {
    this.composer = options.composer;
    this.#rootLocation = options.root;
  }

  /**
   * Attach this link to a parent.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachToParent(parentRoute: RouteRecordType<any, any, any>) {
    // TODO: recover this check
    // if (this.#state !== "unattached") {
    //   throw new Error("A builder cannot be attached more than once.");
    // }
    this.#state = {
      state: "attached",
      parentRoute,
    };
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
      this.#state.inheritor = res.last;
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
      throw new Error("This RoutesBuilder is already invalidated.");
    }
  }

  getParentRoute(): RouteRecordType<ActionResult, never, boolean> | undefined {
    return this.followInheritanceChain((link) => link.#state.parentRoute)
      .result;
  }

  getRootLocation(): Location {
    return this.followInheritanceChain((link) => link.#rootLocation).result;
  }

  getBuilderLink(): this {
    return this;
  }

  getChildBuilder():
    | AttachableRoutesBuilder<ActionResult, Segment>
    | undefined {
    return this.#childBuilder;
  }

  /**
   * TODO: wanna deprecate in favor of inherit
   */
  clone(): BuilderLink<ActionResult, Segment> {
    const result = new BuilderLink<ActionResult, Segment>({
      composer: this.composer,
      root: this.#rootLocation,
    });
    result.#state = this.#state;
    return result;
  }

  /**
   * TODO: rethink
   */
  register(builder: AttachableRoutesBuilder<ActionResult, Segment>): void {
    this.#childBuilder = builder;
  }

  /**
   * Create a new BuilderLink which inherits current link.
   */
  inherit(): BuilderLink<ActionResult, Segment> {
    switch (this.#state.state) {
      case "unattached": {
        return this.clone();
      }
      case "attached": {
        const result = new BuilderLink<ActionResult, Segment>({
          composer: this.composer,
          root: this.#rootLocation,
        });

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

  getResolver(
    resolveSegment: SegmentResolver<ActionResult, Segment>
  ): RouteResolver<ActionResult, Segment> {
    this.checkInvalidation();
    return new RouteResolver(this.composer, resolveSegment);
  }
}
