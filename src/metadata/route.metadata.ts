import {
  ControllerConstructor,
  ControllerMethod,
  ControllerMethodMetaArg,
  RouteMethods,
} from "../types/common.types.js";
import Validator from "../validators/validator.js";
import Metadata from "./metadata.js";

export const routeMetadata = new Metadata<
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
