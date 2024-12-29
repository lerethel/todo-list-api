import { ErrorRequestHandler } from "express";
import { HttpException } from "../exceptions/http.exception.js";

export default ((error: Error | HttpException, req, res, next) => {
  if (error instanceof HttpException) {
    const { message, status } = error;
    return message
      ? res.status(status).json([{ message }])
      : res.jsonStatus(status);
  }

  console.error(error.stack);
  res.jsonStatus(500);
}) satisfies ErrorRequestHandler;
