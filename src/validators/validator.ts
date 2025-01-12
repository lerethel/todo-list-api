import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import Inject from "../decorators/inject.decorator.js";
import ResourceService from "../services/resource.service.js";
import { IResourceService } from "../types/service.types.js";
import StatusCode from "../utils/enums/status-code.enum.js";

export default class Validator {
  @Inject(ResourceService)
  protected readonly resourceService: IResourceService;

  constructor(private readonly validators: ValidationChain[]) {
    this.sendErrorsIfExist = this.sendErrorsIfExist.bind(this);
  }

  private async sendErrorsIfExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Send only the messages.
    res.status(StatusCode.BadRequest).json(
      await Promise.all(
        errors.array().map(async ({ msg: token }) => ({
          message: await this.resourceService.find(token),
        }))
      )
    );
  }

  toMiddleware() {
    return [...this.validators, this.sendErrorsIfExist];
  }
}
