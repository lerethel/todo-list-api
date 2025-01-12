import { body, param, query } from "express-validator";
import ResourceToken from "../config/enums/resource-token.enum.js";

export const todoTitle = body("title")
  .notEmpty()
  .withMessage(ResourceToken.TodoNoTitle);

export const todoDescription = body("description")
  .notEmpty()
  .withMessage(ResourceToken.TodoNoDescription);

export const todoIdParam = param("id")
  .isMongoId()
  .withMessage(ResourceToken.TodoInvalidId);

export const todoPageQuery = query("page")
  .isNumeric()
  .withMessage(ResourceToken.TodoInvalidPage);

export const todoLimitQuery = query("limit")
  .isNumeric()
  .withMessage(ResourceToken.TodoInvalidLimit);

// date=yyyy-mm-dd -> look from the date; date=yyyy-mm-dd:yyyy-mm-dd -> look between the dates
// A date starts at 00:00.
const rdateQuery = /^\d{4}-\d{2}-\d{2}(?::\d{4}-\d{2}-\d{2})?$/;
export const todoDateQuery = query("date")
  .optional()
  .trim()
  .custom((value) => rdateQuery.test(value))
  .withMessage(ResourceToken.TodoInvalidDate);

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
  .withMessage(ResourceToken.TodoInvalidSort);

export const userName = body("name")
  .trim()
  .notEmpty()
  .withMessage(ResourceToken.UserNoName);

export const userEmail = body("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage(ResourceToken.UserInvalidEmail);

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
  ResourceToken.UserNoPassword,
  ResourceToken.UserShortPassword
);

export const userPasswordOnUpdate = createPasswordValidator(
  "password",
  ResourceToken.UserNoCurrentPassword,
  ResourceToken.UserShortCurrentPassword
);

export const userNewPassword = createPasswordValidator(
  "new-password",
  ResourceToken.UserNoNewPassword,
  ResourceToken.UserShortNewPassword
)
  .bail()
  .custom(
    (newPassword, { req }) => newPassword === req.body["confirmed-new-password"]
  )
  .withMessage(ResourceToken.UserPasswordMismatch);
