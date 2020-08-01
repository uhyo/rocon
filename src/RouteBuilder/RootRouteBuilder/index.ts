import { BuilderLink } from "../../BuilderLink";
import { AttachableRouteBuilder } from "../../BuilderLink/AttachableRouteBuilder";
import { identityLocationComposer } from "../../LocationComposer/IdentityLocationComposer";
import { Location } from "../../LocationComposer/Location";
import { RouteRecordType } from "../RouteRecord";
import { IdentityRouteRecord } from "../RouteRecord/IdentityRouteRecord";
import { ActionType } from "../RoutesDefinitionObject";
import { SingleRouteAbstractBuilder } from "../SingleRouteAbstractBuilder";
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
> extends SingleRouteAbstractBuilder<ActionResult, Match, boolean>
  implements AttachableRouteBuilder<ActionResult, unknown> {
  static init<ActionResult>(
    options: Partial<RootRouteBuilderOptions> = {}
  ): RootRouteBuilder<ActionResult, "noaction", {}> {
    const link = BuilderLink.init<ActionResult, unknown>({
      composer: identityLocationComposer,
      root: options.root,
    });
    return new RootRouteBuilder<ActionResult, "noaction", {}>(link);
  }

  #route: IdentityRouteRecord<ActionResult, Match, boolean>;
  #link: BuilderLink<ActionResult, unknown>;

  private constructor(link: BuilderLink<ActionResult, unknown>) {
    super();
    this.#link = link;
    this.#route = new IdentityRouteRecord(this, undefined);
    link.register(this, () => {
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

  action(
    action: ActionType<ActionResult, Match>
  ): RootRouteBuilder<ActionResult, "hasaction", Match> {
    const result = new RootRouteBuilder<ActionResult, "hasaction", Match>(
      this.#link.inherit()
    );
    result.#route = new IdentityRouteRecord(result, action);
    return result;
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
}
