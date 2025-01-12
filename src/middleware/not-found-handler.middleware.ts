import { HandlerContext, IMiddleware } from "../types/common.types.js";
import StatusCode from "../utils/enums/status-code.enum.js";

export default class NotFoundHandlerMiddleware implements IMiddleware {
  use({ res }: HandlerContext) {
    res.jsonStatus(StatusCode.NotFound);
  }
}
