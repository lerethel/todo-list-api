import Injectable from "../decorators/injectable.decorator.js";
import userStore from "../stores/user.store.js";
import { IUserStoreService } from "../types/service.types.js";

@Injectable()
export default class UserStoreService implements IUserStoreService {
  get(): unknown {
    return userStore.get();
  }
}
