import { controllerMetadata } from "../metadata/controller.metadata.js";

export default function Controller<T extends object>(path: string) {
  return (target: T) => {
    controllerMetadata.set(target, path);
  };
}
