import { RequestHandler } from "express";
import { body, param, query, validationResult } from "express-validator";

export const sendErrorsIfExist: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Send only the messages.
    return res
      .status(400)
      .json(errors.array().map(({ msg: message }) => ({ message })));
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
  .isMongoId()
  .withMessage("Valid to-do id must be specified.");

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
  .withMessage("Valid field name(s) to sort by must be specified.");

export const userName = body("name")
  .trim()
  .notEmpty()
  .withMessage("User name must be specified.");

export const userEmail = body("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage("Valid email must be specified.");

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
  "Password must be specified.",
  "Password must contain at least 6 characters."
);

export const userPasswordOnUpdate = createPasswordValidator(
  "password",
  "Current password must be specified.",
  "Current password must contain at least 6 characters."
);

export const userNewPassword = createPasswordValidator(
  "new-password",
  "New password must be specified.",
  "New password must contain at least 6 characters."
)
  .bail()
  .custom(
    (newPassword, { req }) => newPassword === req.body["confirmed-new-password"]
  )
  .withMessage("Passwords do not match.");
