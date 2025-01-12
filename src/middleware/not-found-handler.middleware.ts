import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "../types/common.types.js";

export default class NotFoundHandlerMiddleware implements IMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.jsonStatus(404);
  }
}
