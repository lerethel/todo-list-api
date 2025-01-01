import { injectorMetadata } from "../metadata/injector.metadata.js";
import { InjectableConstructor } from "../types/common.types.js";

export default function Inject<T extends InjectableConstructor>(injectable: T) {
  return (target: undefined) => (): InstanceType<T> =>
    injectorMetadata.get(injectable);
}
