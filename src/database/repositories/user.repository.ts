import Injectable from "../../decorators/injectable.decorator.js";
import { IUser } from "../../types/database.types.js";
import userModel from "../models/user.model.js";
import Repository from "./repository.js";

@Injectable(userModel)
export default class UserRepository extends Repository<IUser> {}
