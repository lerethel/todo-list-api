import Injectable from "../../decorators/injectable.decorator.js";
import { IToken } from "../../types/database.types.js";
import tokenModel from "../models/token.model.js";
import Repository from "./repository.js";

@Injectable(tokenModel)
export default class TokenRepository extends Repository<IToken> {}
