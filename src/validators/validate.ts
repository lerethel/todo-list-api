import { body, param, query } from "express-validator";
import lang from "../config/lang.js";

export const todoTitle = body("title")
  .notEmpty()
  .withMessage(lang.todo.NO_TITLE);

export const todoDescription = body("description")
  .notEmpty()
  .withMessage(lang.todo.NO_DESCRIPTION);

export const todoIdParam = param("id")
  .isMongoId()
  .withMessage(lang.todo.INVALID_ID);

export const todoPageQuery = query("page")
  .isNumeric()
  .withMessage(lang.todo.INVALID_PAGE);

export const todoLimitQuery = query("limit")
  .isNumeric()
  .withMessage(lang.todo.INVALID_LIMIT);

// date=yyyy-mm-dd -> look from the date; date=yyyy-mm-dd:yyyy-mm-dd -> look between the dates
// A date starts at 00:00.
const rdateQuery = /^\d{4}-\d{2}-\d{2}(?::\d{4}-\d{2}-\d{2})?$/;
export const todoDateQuery = query("date")
  .optional()
  .trim()
  .custom((value) => rdateQuery.test(value))
  .withMessage(lang.todo.INVALID_DATE);

// sort=field -> ascending order; sort=-field -> descending order
// Multiple fields are allowed and must be separated by a whitespace, e.g., "title -createdAt".
const sortQueryAllowedFields = new Set(["title", "createdAt", "description"]);
export const todoSortQuery = query("sort")
  .optional()
  .trim()
  .custom((value) =>
    value
      .replace("-", "")
      .split(" ")
      .every((field: string) => sortQueryAllowedFields.has(field))
  )
  .withMessage(lang.todo.INVALID_SORT);

export const userName = body("name")
  .trim()
  .notEmpty()
  .withMessage(lang.user.NO_NAME);

export const userEmail = body("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage(lang.user.INVALID_EMAIL);

const createPasswordValidator = (
  field: string,
  passwordNotSpecifiedMessage: string,
  passwordTooShortMessage: string
) =>
  body(field)
    .notEmpty()
    .withMessage(passwordNotSpecifiedMessage)
    .bail()
    .isLength({ min: 6 })
    .withMessage(passwordTooShortMessage);

export const userPassword = createPasswordValidator(
  "password",
  lang.user.NO_PASSWORD,
  lang.user.SHORT_PASSWORD
);

export const userPasswordOnUpdate = createPasswordValidator(
  "password",
  "Current " + lang.user.NO_PASSWORD.toLowerCase(),
  "Current " + lang.user.SHORT_PASSWORD.toLowerCase()
);

export const userNewPassword = createPasswordValidator(
  "new-password",
  "New password " + lang.user.NO_PASSWORD.toLowerCase(),
  "New password " + lang.user.SHORT_PASSWORD.toLowerCase()
)
  .bail()
  .custom(
    (newPassword, { req }) => newPassword === req.body["confirmed-new-password"]
  )
  .withMessage(lang.user.PASSWORD_MISMATCH);
