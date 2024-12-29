import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

export default class Validator {
  constructor(private readonly validators: ValidationChain[]) {}

  private sendErrorsIfExist(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Send only the messages.
      return res
        .status(400)
        .json(errors.array().map(({ msg: message }) => ({ message })));
    }

    next();
  }

  toMiddleware() {
    return [...this.validators, this.sendErrorsIfExist];
  }
}
