import { NextFunction, Request, Response } from "express";
import { ValidationChain } from "express-validator";
import HttpException from "../exceptions/http.exception.js";

declare module "express-serve-static-core" {
  interface Application {
    validator?: ValidatorConstructor;
  }
  interface Response {
    jsonStatus: (code: number) => Response;
  }
}

export interface AsyncUserStorage {
  user: unknown;
}

export type RouteMethods = "post" | "get" | "put" | "delete";

export type ControllerConstructor = new () => object;

export type InjectableConstructor = new (...args: any[]) => any;

export type ControllerMethod = (...args: any[]) => Promise<unknown>;

export type ControllerMethodMetaArg = {
  meta: ["req", "params" | "body" | "query" | "cookies"] | ["req" | "res"];
  key?: string;
};

export type HandlerContext = {
  req: Request;
  res: Response;
  next: NextFunction;
};

export type ValidatorConstructor = new (
  validations: ValidationChain[]
) => IValidator;

export interface IMiddleware {
  use(context: HandlerContext): any;
}

export interface IExceptionFilter {
  use(error: Error | HttpException, context: HandlerContext): any;
}

export interface IValidator {
  run(req: Request): Promise<void>;
}
