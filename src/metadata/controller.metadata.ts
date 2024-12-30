import { ControllerConstructor } from "../types/common.types.js";

export const controllerMetadata = new Map<
  ControllerConstructor,
  { path: string; isProtected?: boolean }
>();
