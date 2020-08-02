import { AttachFunction } from "../RouteRecord/RouteRecordType";
import { ActionType } from "../RoutesDefinitionObject";

export type PathSingleRouteInterface<ActionResult, Match> = {
  action: (
    action: ActionType<ActionResult, Match>
  ) => PathSingleRouteInterface<ActionResult, Match>;
  attach: AttachFunction<ActionResult, Match>;
};
