import { ValidationChain } from "express-validator";
import { routeMetadata } from "../metadata/route.metadata.js";
import { ControllerMethod } from "../types/common.types.js";

export default function Validated(...validations: ValidationChain[]) {
  return (target: ControllerMethod, context: ClassMethodDecoratorContext) => {
    context.addInitializer(function () {
      routeMetadata.update(target, { validations });
    });
  };
}
