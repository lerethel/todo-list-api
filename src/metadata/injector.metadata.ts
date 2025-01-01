import { InjectableConstructor } from "../types/common.types.js";

export const injectorMetadata = new Map<
  InjectableConstructor,
  InstanceType<InjectableConstructor>
>();
