import { ValidationChain } from "express-validator";
import {
  ControllerConstructor,
  ControllerMethod,
  ControllerMethodMetaArg,
  RouteMethods,
} from "../types/common.types.js";
import Metadata from "./metadata.js";

export const routeMetadata = new Metadata<
  ControllerMethod,
  {
    method: RouteMethods;
    path: string;
    controller: InstanceType<ControllerConstructor>;
    isProtected?: boolean;
    validations?: ValidationChain[];
    status?: number;
    args?: ControllerMethodMetaArg[];
  }
>();
