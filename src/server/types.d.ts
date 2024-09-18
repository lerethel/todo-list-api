import type express from "express";
import type validator from "express-validator";
import type mongoose from "mongoose";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
    }
  }
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

export interface IUser {
  user: string;
  email: string;
  password: string;
  refreshToken?: string;
}

export interface ITodo {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  timestamp: number;
}

export type RequestHandler = express.RequestHandler;

export type ValidatedHandler = [
  ...validator.ValidationChain[],
  RequestHandler,
  RequestHandler
];
