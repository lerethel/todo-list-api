import userModel from "../models/user.model.js";
import { IUser } from "../types/database.types.js";
import Repository from "./repository.js";

class UserRepository extends Repository<IUser> {}

export default new UserRepository(userModel);
