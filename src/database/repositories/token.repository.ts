import { IToken } from "../../types/database.types.js";
import tokenModel from "../models/token.model.js";
import Repository from "./repository.js";

class TokenRepository extends Repository<IToken> {}

export default new TokenRepository(tokenModel);
