import { RequestHandler } from "express";
import { ControllerConstructor, RouteMethods } from "../types/common.types.js";
import Validator from "../validators/validator.js";

export const routeMetadata = new Map<
  RequestHandler,
  {
    method: RouteMethods;
    path: string;
    isProtected?: boolean;
    validator?: Validator;
    controller: InstanceType<ControllerConstructor>;
  }
>();
