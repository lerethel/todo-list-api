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

export type ControllerMethod = (...args: any[]) => Promise<unknown>;

export type ControllerMethodMetaArg = {
  meta: ["req", "params" | "body" | "query" | "cookies"] | ["req" | "res"];
  key?: string;
};
