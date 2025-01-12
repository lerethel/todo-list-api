import { NextFunction, Request, Response } from "express";
import userStore from "../stores/user.store.js";
import { IMiddleware } from "../types/common.types.js";

export default class UserStoreMiddleware implements IMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    userStore.init(next);
  }
}
