import { RequestHandler } from "express";
import { routeMetadata } from "../metadata/route.metadata.js";

export default function Protected(
  target: RequestHandler,
  context: ClassMethodDecoratorContext
) {
  context.addInitializer(function () {
    routeMetadata.get(target)!.isProtected = true;
  });
}
