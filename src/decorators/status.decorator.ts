import { routeMetadata } from "../metadata/route.metadata.js";
import { ControllerMethod } from "../types/common.types.js";

export default function Status(status: number) {
  return (target: ControllerMethod, context: ClassMethodDecoratorContext) => {
    context.addInitializer(function () {
      routeMetadata.get(target)!.status = status;
    });
  };
}
