import Injectable from "../decorators/injectable.decorator.js";
import userStore from "../stores/user.store.js";

@Injectable()
export default class UserStoreService {
  get() {
    return userStore.get();
  }
}
