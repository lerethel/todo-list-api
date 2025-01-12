import { IMiddleware, HandlerContext } from "../types/common.types.js";

export default class NotFoundHandlerMiddleware implements IMiddleware {
  use({ res }: HandlerContext) {
    res.jsonStatus(404);
  }
}
