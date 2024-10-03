import type { RequestHandler, ValidatedHandler } from "../types.js";

import Todo from "../models/todo.js";
import Token from "../models/token.js";
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
    const foundUser = await User.findOne({ email }).lean().exec();

    if (!foundUser || !(await pwd.compare(foundUser.password, password))) {
      return res.sendStatus(401);
    }

    token.send(res, 200, foundUser);
  },
];

export const refreshUser = token.verifyRefresh;

export const logoutUser = token.revoke;

export const getUser: [RequestHandler, RequestHandler] = [
  token.verifyAccess,
  async (req, res) => {
    const foundUser = await User.findById(req.user, "user email").lean().exec();

    if (!foundUser) {
      return res.sendStatus(404);
    }

    const { user, email } = foundUser;
    res.status(200).json({ user, email });
  },
];

export const updateUser: ValidatedHandler = [
  token.verifyAccess,
  validate.userName,
  validate.userEmailOnUpdate,
  validate.userPassword,
  validate.sendErrorsIfExist,
  async (req, res) => {
    const { user, email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { user, email, password: await pwd.hash(password) },
      { returnDocument: "after", lean: true }
    ).exec();

    if (!updatedUser) {
      return res.sendStatus(404);
    }

    res.sendStatus(200);
  },
];

export const deleteUser: [RequestHandler, RequestHandler] = [
  token.verifyAccess,
  async (req, res, next) => {
    const { user } = req;

    // Delete the user and all their data.
    await Promise.all([
      User.deleteOne({ _id: user }).exec(),
      Todo.deleteMany({ user }).exec(),
      Token.deleteMany({ user }).exec(),
    ]);

    token.revoke(req, res, next);
  },
];
