import { ValidationChain } from "express-validator";
import { routeMetadata } from "../metadata/route.metadata.js";
import { ControllerMethod } from "../types/common.types.js";
import Validator from "../validators/validator.js";

export default function Validated(validators: ValidationChain[]) {
  return (target: ControllerMethod, context: ClassMethodDecoratorContext) => {
    context.addInitializer(function () {
      routeMetadata.update(target, { validator: new Validator(validators) });
    });
  };
}
