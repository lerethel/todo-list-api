import { IExceptionFilter } from "../types/common.types.js";

export default (filters: (new () => IExceptionFilter)[]) =>
  filters.map((fn) => {
    const handler = new fn();
    return handler.use.bind(handler);
  });
