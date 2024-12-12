import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HttpException } from "../exceptions/http.exception.js";

export const verifyAccess: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith("Bearer")) {
    throw new HttpException(401);
  }

  const token = authorization.split(" ")[1];

  try {
    req.user = (
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as JwtPayload
    ).user;
  } catch {
    throw new HttpException(403);
  }

  next();
};
