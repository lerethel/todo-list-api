import type express from "express";
import type validator from "express-validator";
import type mongoose from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    user?: string;
    validationErrorStatus?: number;
  }
  interface Response {
    jsonStatus: (code: number) => Response;
  }
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IToken {
  user: mongoose.Types.ObjectId;
  family: string;
  refreshToken: string;
}

export interface ITodo {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  timestamp: number;
}

export type RequestHandler = express.RequestHandler;

export type ValidatedHandler =
  | [
      validator.ValidationChain,
      ...validator.ValidationChain[],
      RequestHandler,
      RequestHandler
    ]
  | [
      RequestHandler,
      validator.ValidationChain,
      ...validator.ValidationChain[],
      RequestHandler,
      RequestHandler
    ];
