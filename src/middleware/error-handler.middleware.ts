import { ErrorRequestHandler } from "express";
import { HttpException } from "../exceptions/http.exception.js";

export default ((error: Error | HttpException, req, res, next) => {
  if (error instanceof HttpException) {
    return res.jsonStatus(error.status);
  }

  console.error(error.stack);
  res.jsonStatus(500);
}) satisfies ErrorRequestHandler;
