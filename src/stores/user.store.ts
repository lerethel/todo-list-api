import { AsyncLocalStorage } from "async_hooks";
import { AsyncUserStorage } from "../types/common.types.js";

class UserStore {
  private readonly store = new AsyncLocalStorage<AsyncUserStorage>();

  init(callback: () => void) {
    this.store.run({} as AsyncUserStorage, callback);
  }

  get() {
    return this.store.getStore()!.user;
  }

  set(user: unknown) {
    this.store.getStore()!.user = user;
  }
}

export default new UserStore();
