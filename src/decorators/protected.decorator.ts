import { RequestHandler } from "express";
import { controllerMetadata } from "../metadata/controller.metadata.js";
import { routeMetadata } from "../metadata/route.metadata.js";

export default function Protected<T extends object>(
  { excluded } = { excluded: false }
) {
  return (
    target: RequestHandler | T,
    context: typeof target extends RequestHandler
      ? ClassMethodDecoratorContext
      : ClassDecoratorContext
  ) => {
    if (context.kind === "method") {
      context.addInitializer(function () {
        routeMetadata.get(target as RequestHandler)!.isProtected = !excluded;
      });
    } else if (context.kind === "class") {
      controllerMetadata.get(target as T)!.isProtected = true;
    }
  };
}
