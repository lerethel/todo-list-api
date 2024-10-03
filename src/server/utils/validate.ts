import type { RequestHandler } from "../types.js";

import { body, param, query, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import Todo from "../models/todo.js";
import User from "../models/user.js";

export const sendErrorsIfExist: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Send only the messages.
    return res
      .status(req.validationErrorStatus ?? 400)
      .json(errors.array().map(({ msg }) => ({ message: msg })));
  }

  next();
};

export const todoTitle = body("title")
  .notEmpty()
  .withMessage("To-do title must be specified.");

export const todoDescription = body("description")
  .notEmpty()
  .withMessage("To-do description must be provided.");

export const todoIdParam = param("id")
  .custom((id) => isValidObjectId(id))
  .withMessage("Valid to-do id must be specified.")
  .bail()
  .custom(async (id, { req }) => {
    if (await Todo.exists({ user: req.user, _id: id }).exec()) {
      return Promise.resolve();
    }

    req.validationErrorStatus = 404;
    return Promise.reject();
  })
  .withMessage("Todo does not exist.");

export const todoPageQuery = query("page")
  .isNumeric()
  .withMessage("Valid page number must be specified.");

export const todoLimitQuery = query("limit")
  .isNumeric()
  .withMessage("Valid max to-do number must be specified.");

// date=yyyy-mm-dd -> look from the date; date=yyyy-mm-dd:yyyy-mm-dd -> look between the dates
// A date starts at 00:00.
const rdateQuery = /^\d{4}-\d{2}-\d{2}(?::\d{4}-\d{2}-\d{2})?$/;
export const todoDateQuery = query("date")
  .optional()
  .trim()
  .custom((value) => rdateQuery.test(value))
  .withMessage("Valid date must be specified.");

// sort=field -> ascending order; sort=-field -> descending order
// Multiple fields are allowed and must be separated by a whitespace, e.g., "title -timestamp".
const sortQueryAllowedFields = new Set(["title", "timestamp", "description"]);
export const todoSortQuery = query("sort")
  .optional()
  .trim()
  .toLowerCase()
  .custom((value) =>
    value
      .replace("-", "")
      .split(" ")
      .every((field: string) => sortQueryAllowedFields.has(field))
  )
  .withMessage("Valid field name(s) to sort by must be specified.");

export const userName = body("user")
  .trim()
  .notEmpty()
  .withMessage("User name must be specified.");

export const userEmailOnRegister = body("email")
  .trim()
  .isEmail()
  .withMessage("Valid email must be specified.")
  .bail()
  .custom(async (email, { req }) => {
    if (await User.exists({ email }).exec()) {
      req.validationErrorStatus = 409;
      return Promise.reject();
    }

    return Promise.resolve();
  })
  .withMessage("User already exists.");

export const userEmailOnLogin = body("email")
  .trim()
  .isEmail()
  .withMessage("Valid email must be specified.");

export const userEmailOnUpdate = body("email")
  .trim()
  .isEmail()
  .withMessage("Valid email must be specified.")
  .bail()
  .custom(async (email, { req }) => {
    const user = await User.exists({ email }).exec();

    if (!user || user._id.toString() === req.user) {
      return Promise.resolve();
    }

    req.validationErrorStatus = 409;
    return Promise.reject();
  })
  .withMessage("User already exists.");

export const userPassword = body("password")
  .notEmpty()
  .withMessage("Password must be specified.")
  .bail()
  .isLength({ min: 6 })
  .withMessage("Password must contain at least 6 characters.");
