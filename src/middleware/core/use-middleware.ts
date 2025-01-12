import { IMiddleware } from "../../types/common.types.js";

export default (middleware: (new () => IMiddleware)[]) =>
  middleware.map((fn) => {
    const handler = new fn();
    return handler.use.bind(handler);
  });
