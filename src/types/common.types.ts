import { RequestHandler } from "express";
import { ValidationChain } from "express-validator";

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

export type ValidatedHandler =
  | [ValidationChain, ...ValidationChain[], RequestHandler, RequestHandler]
  | [
      RequestHandler,
      ValidationChain,
      ...ValidationChain[],
      RequestHandler,
      RequestHandler
    ];
