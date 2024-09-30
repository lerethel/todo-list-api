import type { CookieOptions, Response } from "express";
import type { FlattenMaps, Types } from "mongoose";
import type { IUser, RequestHandler } from "../types.js";

import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import Token from "../models/token.js";

// Both ages are in seconds.
const accessTokenMaxAge = 300;
const refreshTokenMaxAge = 60 * 60 * 24 * 180;

function createAccess(user: string) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: accessTokenMaxAge,
  });
}

function createRefresh(user: string, family: string) {
  return jwt.sign({ user, family }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: refreshTokenMaxAge,
  });
}

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 1000 * refreshTokenMaxAge,
};

export const send = async (
  res: Response,
  status: number,
  user: FlattenMaps<IUser> & { _id: Types.ObjectId }
) => {
  const id = user._id.toString();
  const family = randomUUID();
  const refreshToken = createRefresh(id, family);

  res.cookie("jwt", refreshToken, refreshTokenCookieOptions);
  await Token.create({ user: id, family, refreshToken });

  res.status(status).json({ token: createAccess(id) });
};

export const revoke: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (refreshToken) {
    res.clearCookie("jwt", refreshTokenCookieOptions);
    await Token.deleteOne({ refreshToken }).exec();
  }

  res.sendStatus(204);
};

export const verifyAccess: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization?.startsWith("Bearer")) {
    return res.sendStatus(401);
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = (decoded as jwt.JwtPayload).user;
    next();
  });
};

export const verifyRefresh: RequestHandler = async (req, res) => {
  const refreshToken: string | undefined = req.cookies.jwt;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      const storedToken = await Token.findOne({ refreshToken }).lean().exec();
      const { user, family } = decoded as jwt.JwtPayload;

      // If a refresh token is in the cookies but not in the database,
      // consider this a reuse attempt and delete the compromised family.
      if (!storedToken) {
        await Token.deleteOne({ family }).exec();
        return res.sendStatus(403);
      }

      if (storedToken.user.toString() !== user) {
        return res.sendStatus(403);
      }

      const newRefreshToken = createRefresh(user, family);

      // Replace the refresh token with a new one.
      res.cookie("jwt", newRefreshToken, refreshTokenCookieOptions);
      await Token.updateOne(
        { refreshToken },
        { refreshToken: newRefreshToken }
      ).exec();

      res.json({ token: createAccess(user) });
    }
  );
};
