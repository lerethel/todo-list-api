import { routeMetadata } from "../metadata/route.metadata.js";
import {
  ControllerConstructor,
  ControllerMethod,
  RouteMethods,
} from "../types/common.types.js";

const Route = (method: RouteMethods, path: string) => {
  return (target: ControllerMethod, context: ClassMethodDecoratorContext) => {
    context.addInitializer(function () {
      routeMetadata.set(target, {
        method,
        path: path.endsWith("/") ? path.slice(0, -1) : path,
        controller: this as InstanceType<ControllerConstructor>,
      });
    });
  };
};

export const Post = (path: string) => Route("post", path);

export const Get = (path: string) => Route("get", path);

export const Put = (path: string) => Route("put", path);

export const Delete = (path: string) => Route("delete", path);
