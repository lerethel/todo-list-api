import { ErrorRequestHandler } from "express";
import { IExceptionFilter } from "../../types/common.types.js";

export default (
  ...filters: (new () => IExceptionFilter)[]
): ErrorRequestHandler[] =>
  filters.map((fn) => {
    const handler = new fn();
    return (error, req, res, next) =>
      handler.use.call(handler, error, { req, res, next });
  });
