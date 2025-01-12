import { rateLimit } from "express-rate-limit";
import config from "../config/config.js";
import Env from "../config/enums/env.enum.js";
import { IMiddleware, HandlerContext } from "../types/common.types.js";

export default class RateLimitMiddleware implements IMiddleware {
  private readonly limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: config.ENV === Env.Production ? 30 : 500,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler(req, res, next, { statusCode, message }) {
      res.status(statusCode).json([{ message }]);
    },
  });

  use({ req, res, next }: HandlerContext) {
    this.limiter(req, res, next);
  }
}
