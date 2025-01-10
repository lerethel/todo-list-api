import { ControllerConstructor } from "../types/common.types.js";
import Metadata from "./metadata.js";

export const controllerMetadata = new Metadata<
  ControllerConstructor,
  { path: string; isProtected?: boolean }
>();
