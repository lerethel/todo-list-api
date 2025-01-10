import { InjectableConstructor } from "../types/common.types.js";
import Metadata from "./metadata.js";

export const injectorMetadata = new Metadata<
  InjectableConstructor,
  InstanceType<InjectableConstructor>
>();
