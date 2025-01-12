import { RequestHandler, Router } from "express";
import { controllerMetadata } from "../metadata/controller.metadata.js";
import { routeMetadata } from "../metadata/route.metadata.js";
import useMiddleware from "../middleware/use.middleware.js";
import VerifyAccessMiddleware from "../middleware/verify-access.middleware.js";
import {
  ControllerConstructor,
  ControllerMethod,
  ControllerMethodMetaArg,
} from "../types/common.types.js";

export default (controllers: ControllerConstructor[]) => {
  // Instantiate the controllers to initialize method decorators.
  controllers.forEach((controller) => new controller());

  const router = Router();

  routeMetadata.forEach(
    (
      { method, path, isProtected, validator, controller, status, args },
      handler
    ) => {
      const middleware: RequestHandler[] = [];
      const controllerMeta = controllerMetadata.get(
        controller.constructor as ControllerConstructor
      )!;

      if (isProtected ?? controllerMeta.isProtected) {
        middleware.push(
          ...(useMiddleware([VerifyAccessMiddleware]) as RequestHandler[])
        );
      }

      if (validator) {
        middleware.push(...validator.toMiddleware());
      }

      const totalPath = controllerMeta.path + path;

      router[method](
        totalPath,
        middleware,
        wrapHandler(
          handler.bind(controller),
          status ?? (method === "post" ? 201 : method === "delete" ? 204 : 200),
          args
        )
      );

      console.log(
        // https://stackoverflow.com/a/41407246
        "\x1b[32m%s\x1b[0m",
        `Registered route ${method.toUpperCase()} ${totalPath}`
      );
    }
  );

  return router;
};

const wrapHandler =
  (
    handler: ControllerMethod,
    status: number,
    args?: ControllerMethodMetaArg[]
  ): RequestHandler =>
  async (req, res) => {
    const response = await handler(
      ...(args ?? []).map(({ meta, key }) => {
        const [http, field] = meta;
        return http === "req"
          ? field
            ? key
              ? req[field][key]
              : req[field]
            : req
          : res;
      })
    );

    if (response) {
      res.status(status).json(response);
    } else {
      res.jsonStatus(status);
    }
  };
