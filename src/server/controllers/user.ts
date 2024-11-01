import type { RequestHandler, ValidatedHandler } from "../types/types.js";

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
    const { name, email, password } = req.body;
    const createdUser = await User.create({
      name,
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
      return res.jsonStatus(401);
    }

    token.send(res, 200, foundUser);
  },
];

export const refreshUser = token.verifyRefresh;

export const logoutUser = token.revoke;

export const getUser: [RequestHandler, RequestHandler] = [
  token.verifyAccess,
  async (req, res) => {
    const foundUser = await User.findById(req.user, "name email").lean().exec();

    if (!foundUser) {
      return res.jsonStatus(404);
    }

    const { name, email } = foundUser;
    res.status(200).json({ name, email });
  },
];

export const updateUserName: ValidatedHandler = [
  token.verifyAccess,
  validate.userName,
  validate.sendErrorsIfExist,
  async (req, res) => {
    const foundUser = await User.findById(req.user, "name").exec();

    if (!foundUser) {
      return res.jsonStatus(404);
    }

    foundUser.name = req.body.name;
    foundUser.save();

    res.jsonStatus(200);
  },
];

export const updateUserEmail: ValidatedHandler = [
  token.verifyAccess,
  validate.userEmailOnUpdate,
  validate.userPassword,
  validate.sendErrorsIfExist,
  async (req, res) => {
    const foundUser = await User.findById(req.user, "email password").exec();

    if (!foundUser) {
      return res.jsonStatus(404);
    }

    const { email, password } = req.body;

    if (!(await pwd.compare(foundUser.password, password))) {
      return res.jsonStatus(400);
    }

    foundUser.email = email;
    foundUser.save();

    res.jsonStatus(200);
  },
];

export const updateUserPassword: ValidatedHandler = [
  token.verifyAccess,
  validate.userPasswordOnUpdate,
  validate.userNewPassword,
  validate.sendErrorsIfExist,
  async (req, res) => {
    const foundUser = await User.findById(req.user, "password").exec();

    if (!foundUser) {
      return res.jsonStatus(404);
    }

    const { password, "new-password": newPassword } = req.body;

    if (!(await pwd.compare(foundUser.password, password))) {
      return res.jsonStatus(400);
    }

    foundUser.password = await pwd.hash(newPassword);
    foundUser.save();

    res.jsonStatus(200);
  },
];

export const deleteUser: ValidatedHandler = [
  token.verifyAccess,
  validate.userPassword,
  validate.sendErrorsIfExist,
  async (req, res, next) => {
    const { user } = req;
    const foundUser = await User.findById(user, "password").lean().exec();

    if (!foundUser) {
      return res.jsonStatus(404);
    }

    if (!(await pwd.compare(foundUser.password, req.body.password))) {
      return res.jsonStatus(400);
    }

    // Delete the user and all their data.
    await Promise.all([
      User.deleteOne({ _id: user }).exec(),
      Todo.deleteMany({ user }).exec(),
      Token.deleteMany({ user }).exec(),
    ]);

    token.revoke(req, res, next);
  },
];
