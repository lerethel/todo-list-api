import { Request, Response } from "express";

declare module "express-serve-static-core" {
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

export type ControllerMethodContext = {
  body: Request["body"];
  params: Request["params"];
  query: Request["query"];
  cookies: Request["cookies"];
  req: Request;
  res: Response;
};

export type ControllerMethod = (
  context: ControllerMethodContext
) => Promise<unknown>;
