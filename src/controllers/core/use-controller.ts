import { RequestHandler, Router } from "express";
import { ValidationChain } from "express-validator";
import { controllerMetadata } from "../../metadata/controller.metadata.js";
import { routeMetadata } from "../../metadata/route.metadata.js";
import useMiddleware from "../../middleware/core/use-middleware.js";
import VerifyAccessMiddleware from "../../middleware/verify-access.middleware.js";
import {
  ControllerConstructor,
  ControllerMethod,
  ControllerMethodMetaArg,
} from "../../types/common.types.js";
import StatusCode from "../../utils/enums/status-code.enum.js";

export default (...controllers: ControllerConstructor[]) => {
  // Instantiate the controllers to initialize method decorators.
  controllers.forEach((controller) => new controller());

  const router = Router();

  routeMetadata.forEach(
    (
      { method, path, isProtected, validations, controller, status, args },
      handler
    ) => {
      const controllerMeta = controllerMetadata.get(
        controller.constructor as ControllerConstructor
      )!;

      const totalPath = controllerMeta.path + path;

      router[method](
        totalPath,
        isProtected ?? controllerMeta.isProtected
          ? useMiddleware(VerifyAccessMiddleware)
          : [],
        wrapHandler(
          handler.bind(controller),
          status ??
            (method === "post"
              ? StatusCode.Created
              : method === "delete"
              ? StatusCode.NoContent
              : StatusCode.OK),
          args,
          validations
        )
      );

      console.log(
        // https://stackoverflow.com/a/41407246
        "\x1b[32m%s\x1b[0m",
        `Registered route ${method.toUpperCase()} ${totalPath}`
      );

      routeMetadata.delete(handler);
    }
  );

  return router;
};

const wrapHandler =
  (
    handler: ControllerMethod,
    status: number,
    args?: ControllerMethodMetaArg[],
    validations?: ValidationChain[]
  ): RequestHandler =>
  async (req, res) => {
    const { validator } = req.app;

    if (validator && validations) {
      await new validator(validations).run(req);
    }

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
