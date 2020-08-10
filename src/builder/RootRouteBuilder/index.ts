import { BuilderLink } from "../../core/BuilderLink";
import { Location } from "../../core/Location";
import { ConstLocationComposer } from "../composers/ConstLocationComposer";
import {
  AttachableRouteBuilder,
  RouteBuilderLink,
  RouteBuilderLinkValue,
} from "../RouteBuilderLink";
import { RouteRecordType } from "../RouteRecord";
import { ConstRouteRecord } from "../RouteRecord/ConstRouteRecord";
import { ActionType } from "../RoutesDefinitionObject";
import { SingleRouteAbstractBuilder } from "../SingleRouteAbstractBuilder";
import {
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";
import { fillOptions } from "./fillOptions";

export type RootRouteBuilderOptions = {
  root: Location;
};

export class RootRouteBuilder<
  ActionResult,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
>
  extends SingleRouteAbstractBuilder<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  >
  implements AttachableRouteBuilder<ActionResult, unknown> {
  static init<ActionResult>(
    options: Partial<RootRouteBuilderOptions> = {}
  ): RootRouteBuilder<ActionResult, "noaction", {}> {
    fillOptions(options);
    const link = new BuilderLink<
      ActionResult,
      unknown,
      RouteBuilderLinkValue<ActionResult>
    >({
      composer: new ConstLocationComposer(options.root),
    });
    return new RootRouteBuilder<ActionResult, "noaction", {}>(
      link,
      options.root
    );
  }

  #root: Location;
  #route: ConstRouteRecord<ActionResult, Match, boolean>;
  #link: RouteBuilderLink<ActionResult, unknown>;

  private constructor(
    link: RouteBuilderLink<ActionResult, unknown>,
    root: Location
  ) {
    super();
    this.#link = link;
    this.#root = root;
    this.#route = new ConstRouteRecord(this, root, undefined);
    link.register(this, () => {
      const route = this.#route as RouteRecordType<
        ActionResult,
        never,
        boolean
      >;
      return {
        type: "normal",
        value: route,
        link: route.getAttachedBuilderLink(),
      };
    });
  }

  action(
    action: ActionType<ActionResult, Match>
  ): RootRouteBuilder<ActionResult, "hasaction", Match> {
    const root = this.#root;
    const result = new RootRouteBuilder<ActionResult, "hasaction", Match>(
      this.#link.inherit(),
      root
    );
    result.#route = new ConstRouteRecord(result, root, action);
    return result;
  }

  getRoute(): ConstRouteRecord<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route;
  }

  getBuilderLink(): RouteBuilderLink<ActionResult, unknown> {
    return this.#link;
  }
}
