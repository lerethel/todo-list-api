import { RequestHandler } from "express";
import { verifyAccess } from "../middleware/verify-access.middleware.js";
import userService from "../services/user.service.js";
import { ValidatedHandler } from "../types/common.types.js";
import * as validate from "../utils/validate.js";

class UserController {
  create: ValidatedHandler = [
    validate.userName,
    validate.userEmailOnSignup,
    validate.userPassword,
    validate.sendErrorsIfExist,
    async ({ body }, res) => {
      await userService.create(body);
      res.jsonStatus(201);
    },
  ];

  find: [RequestHandler, RequestHandler] = [
    verifyAccess,
    async (req, res) => {
      res.status(200).json(await userService.find());
    },
  ];

  updateName: ValidatedHandler = [
    verifyAccess,
    validate.userName,
    validate.sendErrorsIfExist,
    async ({ body }, res) => {
      await userService.updateName(body);
      res.jsonStatus(200);
    },
  ];

  updateEmail: ValidatedHandler = [
    verifyAccess,
    validate.userEmailOnUpdate,
    validate.userPassword,
    validate.sendErrorsIfExist,
    async ({ body }, res) => {
      await userService.updateEmail(body);
      res.jsonStatus(200);
    },
  ];

  updatePassword: ValidatedHandler = [
    verifyAccess,
    validate.userPasswordOnUpdate,
    validate.userNewPassword,
    validate.sendErrorsIfExist,
    async ({ body }, res) => {
      await userService.updatePassword(body);
      res.jsonStatus(200);
    },
  ];

  delete: ValidatedHandler = [
    verifyAccess,
    validate.userPassword,
    validate.sendErrorsIfExist,
    async ({ body }, res) => {
      await userService.delete(body);
      res.jsonStatus(204);
    },
  ];
}

export default new UserController();
