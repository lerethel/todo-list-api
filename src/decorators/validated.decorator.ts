import { RequestHandler } from "express";
import { ValidationChain } from "express-validator";
import { routeMetadata } from "../metadata/route.metadata.js";
import { sendErrorsIfExist } from "../utils/validate.js";

export default function Validated(validators: ValidationChain[]) {
  return (target: RequestHandler, context: ClassMethodDecoratorContext) => {
    context.addInitializer(function () {
      routeMetadata.get(target)!.validators = [
        ...validators,
        sendErrorsIfExist,
      ];
    });
  };
}
