declare module "express-serve-static-core" {
  interface Request {
    validationErrorStatus?: number;
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
