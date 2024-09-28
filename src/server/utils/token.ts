import type { CookieOptions, Response } from "express";
import type { HydratedDocument } from "mongoose";
import type { IUser, RequestHandler } from "../types.js";

import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Both ages are in seconds.
const accessTokenMaxAge = 300;
const refreshTokenMaxAge = 60 * 60 * 24 * 180;

function createAccess(user: HydratedDocument<IUser>) {
  return jwt.sign(
    { user: user._id.toString() },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenMaxAge }
  );
}

function createRefresh(user: HydratedDocument<IUser>) {
  return jwt.sign(
    { user: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenMaxAge }
  );
}

function removeRefresh(user: HydratedDocument<IUser>, refreshToken: string) {
  return (user.refreshTokens ?? []).filter((rt) => rt !== refreshToken);
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
  user: HydratedDocument<IUser>
) => {
  const refreshToken = createRefresh(user);
  const accessToken = createAccess(user);

  res.cookie("jwt", refreshToken, refreshTokenCookieOptions);

  user.refreshTokens ??= [];
  user.refreshTokens.push(refreshToken);
  await user.save();

  res.status(status).json({ token: accessToken });
};

export const revoke: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) {
    return res.sendStatus(204);
  }

  res.clearCookie("jwt", refreshTokenCookieOptions);

  const user = await User.findOne({ refreshTokens: refreshToken }).exec();

  if (!user?.refreshTokens) {
    return res.sendStatus(204);
  }

  user.refreshTokens = removeRefresh(user, refreshToken);
  await user.save();

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

  const user = await User.findOne(
    { refreshTokens: refreshToken },
    "_id, refreshTokens"
  ).exec();

  if (!user?.refreshTokens) {
    return res.sendStatus(403);
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || user._id.toString() !== (decoded as jwt.JwtPayload).user) {
        return res.sendStatus(403);
      }

      const newRefreshToken = createRefresh(user);

      // Replace the refresh token with a new one.
      res.cookie("jwt", newRefreshToken, refreshTokenCookieOptions);
      user.refreshTokens = removeRefresh(user, refreshToken);
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      res.json({ token: createAccess(user) });
    }
  );
};
