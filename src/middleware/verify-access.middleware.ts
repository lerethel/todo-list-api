import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";
import { HttpException } from "../exceptions/http.exception.js";
import userStore from "../stores/user.store.js";

export default ((req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith("Bearer")) {
    throw new HttpException(401);
  }

  const token = authorization.split(" ")[1];

  try {
    userStore.set(
      (jwt.verify(token, config.ACCESS_TOKEN_SECRET) as JwtPayload).user
    );
  } catch {
    throw new HttpException(403);
  }

  next();
}) satisfies RequestHandler;
