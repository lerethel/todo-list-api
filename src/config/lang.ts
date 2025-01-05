const lang = {
  auth: {
    WRONG_CREDENTIALS: "Login or password is incorrect.",
    WRONG_PASSWORD: "Password is incorrect.",
  },
  user: {
    NO_NAME: "User name must be specified.",
    INVALID_EMAIL: "Valid email must be specified.",
    RESERVED_EMAIL: "Email is already reserved.",
    NO_PASSWORD: "Password must be specified.",
    SHORT_PASSWORD: "Password must contain at least 6 characters.",
    PASSWORD_MISMATCH: "Passwords do not match.",
  },
  todo: {
    NOT_FOUND: "Todo does not exist.",
    NO_TITLE: "To-do title must be specified.",
    NO_DESCRIPTION: "To-do description must be provided.",
    INVALID_ID: "Valid to-do id must be specified.",
    INVALID_PAGE: "Valid page number must be specified.",
    INVALID_LIMIT: "Valid max to-do number must be specified.",
    INVALID_DATE: "Valid date must be specified.",
    INVALID_SORT: "Valid field name(s) to sort by must be specified.",
  },
} as const;

export default lang;
