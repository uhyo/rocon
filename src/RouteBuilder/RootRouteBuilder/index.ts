import { BuilderLink } from "../../BuilderLink";
import { AttachableRouteBuilder } from "../../BuilderLink/AttachableRouteBuilder";
import { identityLocationComposer } from "../../LocationComposer/IdentityLocationComposer";
import { Location } from "../../LocationComposer/Location";
import { RouteResolver } from "../../RouteResolver";
import { RouteRecordType } from "../RouteRecord";
import { IdentityRouteRecord } from "../RouteRecord/IdentityRouteRecord";
import {
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export type RootRouteBuilderOptions = {
  root: Location;
};

export class RootRouteBuilder<
  ActionResult,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
> implements AttachableRouteBuilder<ActionResult, unknown> {
  static init<ActionResult>(
    options: RootRouteBuilderOptions
  ): RootRouteBuilder<ActionResult, "noaction", {}> {
    const link = BuilderLink.init({
      // TODO
      composer: identityLocationComposer,
      root: options.root,
    });
    return new RootRouteBuilder<ActionResult, "noaction", {}>(link);
  }

  #route: IdentityRouteRecord<ActionResult, Match, boolean>;
  #link: BuilderLink<ActionResult, unknown>;

  private constructor(link: BuilderLink<ActionResult, unknown>) {
    this.#link = link;
    this.#route = new IdentityRouteRecord(this, undefined);
  }

  getRoute(): IdentityRouteRecord<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route;
  }

  getBuilderLink(): BuilderLink<ActionResult, unknown> {
    return this.#link;
  }

  getResolver(): RouteResolver<ActionResult, unknown> {
    return this.#link.getResolver(() => {
      const route = this.#route as RouteRecordType<
        ActionResult,
        never,
        boolean
      >;
      return {
        type: "normal",
        route,
      };
    });
  }
}
