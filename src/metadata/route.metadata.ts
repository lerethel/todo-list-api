import {
  ControllerConstructor,
  ControllerMethod,
  RouteMethods,
} from "../types/common.types.js";
import Validator from "../validators/validator.js";

export const routeMetadata = new Map<
  ControllerMethod,
  {
    method: RouteMethods;
    path: string;
    isProtected?: boolean;
    validator?: Validator;
    controller: InstanceType<ControllerConstructor>;
    status?: number;
  }
>();
