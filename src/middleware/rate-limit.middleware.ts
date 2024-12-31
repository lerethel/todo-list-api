import { rateLimit } from "express-rate-limit";
import config from "../config/config.js";
import Env from "../config/enums/env.enum.js";

export default rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: config.ENV === Env.Production ? 30 : 500,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler(req, res, next, { statusCode, message }) {
    res.status(statusCode).json([{ message }]);
  },
});
