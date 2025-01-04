import {
  ControllerConstructor,
  ControllerMethod,
  ControllerMethodMetaArg,
  RouteMethods,
} from "../types/common.types.js";
import Validator from "../validators/validator.js";

export const routeMetadata = new Map<
  ControllerMethod,
  {
    method: RouteMethods;
    path: string;
    controller: InstanceType<ControllerConstructor>;
    isProtected?: boolean;
    validator?: Validator;
    status?: number;
    args?: ControllerMethodMetaArg[];
  }
>();
