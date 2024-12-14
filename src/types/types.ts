import { RequestHandler } from "express";
import { ValidationChain } from "express-validator";
import { Types } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    validationErrorStatus?: number;
  }
  interface Response {
    jsonStatus: (code: number) => Response;
  }
}

export interface AsyncUserStorage {
  user: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IToken {
  user: Types.ObjectId;
  family: string;
  refreshToken: string;
}

export interface ITodo {
  user: Types.ObjectId;
  title: string;
  description: string;
  timestamp: number;
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
