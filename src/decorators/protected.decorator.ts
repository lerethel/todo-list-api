import { RequestHandler } from "express";
import { controllerMetadata } from "../metadata/controller.metadata.js";
import { routeMetadata } from "../metadata/route.metadata.js";
import { ControllerConstructor } from "../types/common.types.js";

export default function Protected({ excluded } = { excluded: false }) {
  return (
    target: RequestHandler | ControllerConstructor,
    context: ClassMethodDecoratorContext | ClassDecoratorContext
  ) => {
    if (context.kind === "method") {
      context.addInitializer(function () {
        routeMetadata.get(target as RequestHandler)!.isProtected = !excluded;
      });
    } else if (context.kind === "class") {
      controllerMetadata.get(target as ControllerConstructor)!.isProtected =
        true;
    }
  };
}
