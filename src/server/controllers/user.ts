import type { ValidatedHandler } from "../types.js";

import User from "../models/user.js";
import * as pwd from "../utils/password.js";
import * as token from "../utils/token.js";
import * as validate from "../utils/validate.js";

export const registerUser: ValidatedHandler = [
  validate.userName,
  validate.userEmailOnRegister,
  validate.userPassword,
  validate.sendErrorsIfExist,
  async (req, res) => {
    const { user, email, password } = req.body;
    const createdUser = await User.create({
      user,
      email,
      password: await pwd.hash(password),
    });

    token.send(res, 201, createdUser);
  },
];

export const loginUser: ValidatedHandler = [
  validate.userEmailOnLogin,
  validate.userPassword,
  validate.sendErrorsIfExist,
  async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser || !(await pwd.compare(foundUser.password, password))) {
      return res.sendStatus(401);
    }

    token.send(res, 200, foundUser);
  },
];

export const refreshUser = token.verifyRefresh;
export const logoutUser = token.revoke;
