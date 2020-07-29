import type { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import type { RouteRecordType } from "../RouteRecord";
import { RouteResolver, SegmentResolver } from "../RouteResolver";
import { assertNever } from "../util/assert";
import { PartiallyPartial } from "../util/types/PartiallyPartial";
import { AttachableRoutesBuilder } from "./AttachableRoutesBuilder";
import type { BuilderLinkOptions } from "./BuilderLinkOptions";
import { fillOptions } from "./fillOptions";

export type RouteRecordsBase<ActionResult> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteRecordType<ActionResult, any, any>
>;

/**
 * State of BuilderLink.
 * - unattached: this link is not attached to a parent.
 * - attached: this link is attached to a parent.
 * - invalidated: this link is invalidated.
 */
type BuilderLinkState = "unattached" | "attached" | "invalidated";

/**
 * Link between parent and child builders.
 */
export class BuilderLink<ActionResult, Segment> {
  static init<ActionResult, Segment>(
    options: PartiallyPartial<BuilderLinkOptions<ActionResult, Segment>, "root">
  ): BuilderLink<ActionResult, Segment> {
    fillOptions(options);
    return new BuilderLink<ActionResult, Segment>(options);
  }

  #state: BuilderLinkState = "unattached";
  /**
   * Registered child builder.
   */
  #childBuilder?: AttachableRoutesBuilder<ActionResult, Segment> = undefined;
  // TODO: want to remove this one
  readonly composer: LocationComposer<Segment>;
  #rootLocation: Location;
  /**
   * Parent of this builder.
   */
  #parentRoute?: RouteRecordType<ActionResult, never, boolean> = undefined;

  private constructor(options: BuilderLinkOptions<ActionResult, Segment>) {
    this.composer = options.composer;
    this.#rootLocation = options.root;
  }

  /**
   * Attach this link to a parent.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attach(parentRoute: RouteRecordType<any, any, any>) {
    // TODO: recover this check
    // if (this.#state !== "unattached") {
    //   throw new Error("A builder cannot be attached more than once.");
    // }
    this.#parentRoute = parentRoute;
    this.#state = "attached";
  }

  checkInvalidation() {
    if (this.#state === "invalidated") {
      throw new Error("This RoutesBuilder is already invalidated.");
    }
  }

  getParentRoute(): RouteRecordType<ActionResult, never, boolean> | undefined {
    this.checkInvalidation();
    return this.#parentRoute;
  }

  getRootLocation() {
    this.checkInvalidation();
    return this.#rootLocation;
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
    result.#parentRoute = this.#parentRoute;
    result.#childBuilder = this.#childBuilder;
    return result;
  }

  /**
   * TODO: rethink
   */
  register(builder: AttachableRoutesBuilder<ActionResult, Segment>): void {
    this.#childBuilder = builder;
  }

  /**
   * Inherit internal information to a builder generated from this.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inheritTo(target: BuilderLink<ActionResult, any>): void {
    target.#parentRoute = this.#parentRoute;
    switch (this.#state) {
      case "unattached": {
        break;
      }
      case "attached": {
        // inherit attachedness to child
        this.#state = "invalidated";
        if (target.#childBuilder !== undefined) {
          // this.#parentRoute should always exist here but we use ?. here for ease
          this.#parentRoute?.attach(target.#childBuilder);
        }
        break;
      }
      case "invalidated": {
        this.checkInvalidation();
        break;
      }
      default: {
        assertNever(this.#state);
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
