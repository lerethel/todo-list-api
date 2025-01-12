import userStore from "../stores/user.store.js";
import { IMiddleware, HandlerContext } from "../types/common.types.js";

export default class UserStoreMiddleware implements IMiddleware {
  use({ next }: HandlerContext) {
    userStore.init(next);
  }
}
