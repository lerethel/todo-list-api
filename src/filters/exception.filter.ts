import Inject from "../decorators/inject.decorator.js";
import { HttpException } from "../exceptions/http.exception.js";
import ResourceService from "../services/resource.service.js";
import { HandlerContext, IExceptionFilter } from "../types/common.types.js";
import { IResourceService } from "../types/service.types.js";
import StatusCode from "../utils/enums/status-code.enum.js";

export default class ExceptionFilter implements IExceptionFilter {
  @Inject(ResourceService)
  protected readonly resourceService: IResourceService;

  async use(error: Error | HttpException, { res }: HandlerContext) {
    if (error instanceof HttpException) {
      const { token, status } = error;
      return token
        ? res
            .status(status)
            .json([{ message: await this.resourceService.find(token) }])
        : res.jsonStatus(status);
    }

    console.error(error.stack);
    res.jsonStatus(StatusCode.InternalServerError);
  }
}
