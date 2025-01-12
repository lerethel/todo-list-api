import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/http.exception.js";
import { IErrorMiddleware } from "../types/common.types.js";

export default class ErrorHandlerMiddleware implements IErrorMiddleware {
  async use(
    error: Error | HttpException,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof HttpException) {
      const { message, status } = error;
      return message
        ? res.status(status).json([{ message }])
        : res.jsonStatus(status);
    }

    console.error(error.stack);
    res.jsonStatus(500);
  }
}
