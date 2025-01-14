import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../exceptions/http.exception.js";
import userStore from "../stores/user.store.js";
import { HandlerContext, IMiddleware } from "../types/common.types.js";

export default class VerifyAccessMiddleware implements IMiddleware {
  use({ req, next }: HandlerContext) {
    const { authorization } = req.headers;

    if (!authorization?.startsWith("Bearer")) {
      throw new UnauthorizedException();
    }

    const token = authorization.split(" ")[1];

    try {
      userStore.set(
        (jwt.verify(token, config.ACCESS_TOKEN_SECRET) as JwtPayload).user
      );
    } catch {
      throw new ForbiddenException();
    }

    next();
  }
}
