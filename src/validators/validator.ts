import { Request } from "express";
import { ValidationChain } from "express-validator";
import { BadRequestException } from "../exceptions/http.exception.js";
import { IValidator } from "../types/common.types.js";

export default class Validator implements IValidator {
  constructor(private readonly validations: ValidationChain[]) {}

  async run(req: Request): Promise<void> {
    const tokens = (
      await Promise.all(
        this.validations.map(async (validation) => {
          const errors = await validation.run(req);
          if (!errors.isEmpty()) {
            return errors.array().map(({ msg }) => msg);
          }
        })
      )
    ).filter((token) => token);

    if (tokens.length) {
      throw new BadRequestException(tokens.flat(1));
    }
  }
}
