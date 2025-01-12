import { RequestHandler } from "express";
import { IMiddleware } from "../../types/common.types.js";

export default (...middleware: (new () => IMiddleware)[]): RequestHandler[] =>
  middleware.map((fn) => {
    const handler = new fn();
    return (req, res, next) => handler.use.call(handler, { req, res, next });
  });
