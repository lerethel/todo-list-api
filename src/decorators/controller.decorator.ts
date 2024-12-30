import { controllerMetadata } from "../metadata/controller.metadata.js";
import { ControllerConstructor } from "../types/common.types.js";

export default function Controller(path: string) {
  return (target: ControllerConstructor) => {
    controllerMetadata.set(target, { path });
  };
}
