import { RequestHandler } from "express";
import { ValidationChain } from "express-validator";
import { RouteMethods } from "../types/common.types.js";

export const routeMetadata = new Map<
  RequestHandler,
  {
    method: RouteMethods;
    path: string;
    isProtected?: boolean;
    validators?: [...ValidationChain[], RequestHandler];
    controller: object;
  }
>();
