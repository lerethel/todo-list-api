import { injectorMetadata } from "../metadata/injector.metadata.js";
import { InjectableConstructor } from "../types/common.types.js";

export default function Injectable<T extends InjectableConstructor>(
  ...args: ConstructorParameters<T>
) {
  return (target: T) => {
    injectorMetadata.set(target, new target(...args));
  };
}
