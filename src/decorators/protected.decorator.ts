import { controllerMetadata } from "../metadata/controller.metadata.js";
import { routeMetadata } from "../metadata/route.metadata.js";
import {
  ControllerConstructor,
  ControllerMethod,
} from "../types/common.types.js";

export default function Protected({ excluded } = { excluded: false }) {
  return (
    target: ControllerMethod | ControllerConstructor,
    context: ClassMethodDecoratorContext | ClassDecoratorContext
  ) => {
    if (context.kind === "method") {
      context.addInitializer(function () {
        routeMetadata.update(target as ControllerMethod, {
          isProtected: !excluded,
        });
      });
    } else if (context.kind === "class") {
      controllerMetadata.update(target as ControllerConstructor, {
        isProtected: true,
      });
    }
  };
}
