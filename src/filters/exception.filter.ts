import { HttpException } from "../exceptions/http.exception.js";
import { IExceptionFilter, HandlerContext } from "../types/common.types.js";

export default class ExceptionFilter implements IExceptionFilter {
  async use(error: Error | HttpException, { res }: HandlerContext) {
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
