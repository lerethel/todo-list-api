import { RequestHandler } from "express";
import { ValidationChain } from "express-validator";
import { routeMetadata } from "../metadata/route.metadata.js";
import Validator from "../validators/validator.js";

export default function Validated(validators: ValidationChain[]) {
  return (target: RequestHandler, context: ClassMethodDecoratorContext) => {
    context.addInitializer(function () {
      routeMetadata.get(target)!.validator = new Validator(validators);
    });
  };
}
