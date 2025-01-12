import { body, param, query } from "express-validator";

export const todoTitle = body("title").notEmpty().withMessage("todo.no-title");

export const todoDescription = body("description")
  .notEmpty()
  .withMessage("todo.no-description");

export const todoIdParam = param("id")
  .isMongoId()
  .withMessage("todo.invalid-id");

export const todoPageQuery = query("page")
  .isNumeric()
  .withMessage("todo.invalid-page");

export const todoLimitQuery = query("limit")
  .isNumeric()
  .withMessage("todo.invalid-limit");

// date=yyyy-mm-dd -> look from the date; date=yyyy-mm-dd:yyyy-mm-dd -> look between the dates
// A date starts at 00:00.
const rdateQuery = /^\d{4}-\d{2}-\d{2}(?::\d{4}-\d{2}-\d{2})?$/;
export const todoDateQuery = query("date")
  .optional()
  .trim()
  .custom((value) => rdateQuery.test(value))
  .withMessage("todo.invalid-date");

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
  .withMessage("todo.invalid-sort");

export const userName = body("name")
  .trim()
  .notEmpty()
  .withMessage("user.no-name");

export const userEmail = body("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage("user.invalid-email");

const createPasswordValidator = (
  field: string,
  passwordNotSpecifiedResource: string,
  passwordTooShortResource: string
) =>
  body(field)
    .notEmpty()
    .withMessage(passwordNotSpecifiedResource)
    .bail()
    .isLength({ min: 6 })
    .withMessage(passwordTooShortResource);

export const userPassword = createPasswordValidator(
  "password",
  "user.no-password",
  "user.short-password"
);

export const userPasswordOnUpdate = createPasswordValidator(
  "password",
  "user.no-current-password",
  "user.short-current-password"
);

export const userNewPassword = createPasswordValidator(
  "new-password",
  "user.no-new-password",
  "user.short-new-password"
)
  .bail()
  .custom(
    (newPassword, { req }) => newPassword === req.body["confirmed-new-password"]
  )
  .withMessage("user.password-mismatch");
