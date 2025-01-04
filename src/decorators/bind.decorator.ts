import { routeMetadata } from "../metadata/route.metadata.js";
import {
  ControllerMethod,
  ControllerMethodMetaArg,
} from "../types/common.types.js";

export default function Bind(...args: ControllerMethodMetaArg[]) {
  return (target: ControllerMethod, context: ClassMethodDecoratorContext) => {
    context.addInitializer(function () {
      routeMetadata.get(target)!.args = args;
    });
  };
}

type BindReqArg = (key?: string) => ControllerMethodMetaArg;

type BindHttpArg = () => ControllerMethodMetaArg;

export const Params: BindReqArg = (key) => ({ meta: ["req", "params"], key });

export const Body: BindReqArg = (key) => ({ meta: ["req", "body"], key });

export const Query: BindReqArg = (key) => ({ meta: ["req", "query"], key });

export const Cookies: BindReqArg = (key) => ({ meta: ["req", "cookies"], key });

export const Req: BindHttpArg = () => ({ meta: ["req"] });

export const Res: BindHttpArg = () => ({ meta: ["res"] });
