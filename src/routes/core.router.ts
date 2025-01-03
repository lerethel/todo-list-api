import { RequestHandler, Router } from "express";
import { controllerMetadata } from "../metadata/controller.metadata.js";
import { routeMetadata } from "../metadata/route.metadata.js";
import verifyAccessMiddleware from "../middleware/verify-access.middleware.js";
import {
  ControllerConstructor,
  ControllerMethod,
} from "../types/common.types.js";

export default (controllers: ControllerConstructor[]) => {
  // Instantiate the controllers to initialize method decorators.
  controllers.forEach((controller) => new controller());

  const router = Router();

  routeMetadata.forEach(
    ({ method, path, isProtected, validator, controller, status }, handler) => {
      const middleware: RequestHandler[] = [];
      const controllerMeta = controllerMetadata.get(
        controller.constructor as ControllerConstructor
      )!;

      if (isProtected ?? controllerMeta.isProtected) {
        middleware.push(verifyAccessMiddleware);
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
          status ?? (method === "post" ? 201 : method === "delete" ? 204 : 200)
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
  (handler: ControllerMethod, status: number): RequestHandler =>
  async (req, res) => {
    const { body, params, query, cookies } = req;
    const context = { body, params, query, cookies, req, res };
    const response = await handler(context);

    if (response) {
      res.status(status).json(response);
    } else {
      res.jsonStatus(status);
    }
  };
