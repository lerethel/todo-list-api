import { rateLimit } from "express-rate-limit";
import config from "../config/config.js";

export default rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: config.ENV === "production" ? 30 : 500,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler(req, res, next, { statusCode, message }) {
    res.status(statusCode).json([{ message }]);
  },
});
