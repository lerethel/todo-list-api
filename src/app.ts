import cookieParser from "cookie-parser";
import express from "express";
import config from "./config/config.js";
import AuthController from "./controllers/auth.controller.js";
import TodoController from "./controllers/todo.controller.js";
import useController from "./controllers/use.controller.js";
import UserController from "./controllers/user.controller.js";
import db from "./database/db.js";
import ExceptionFilter from "./filters/exception.filter.js";
import useFilter from "./filters/use.filter.js";
import NotFoundHandlerMiddleware from "./middleware/not-found-handler.middleware.js";
import RateLimitMiddleware from "./middleware/rate-limit.middleware.js";
import useMiddleware from "./middleware/use.middleware.js";
import UserStoreMiddleware from "./middleware/user-store.middleware.js";
import statusCodes from "./utils/status-codes.js";

// A replacement for res.sendStatus() that sends a JSON object in the validation
// failure format used throughout the project (i.e., as an array of objects).
express.response.jsonStatus = function (code) {
  return this.status(code).json([{ message: statusCodes[code] ?? "" }]);
};

const app = express();

app.use(useMiddleware([RateLimitMiddleware, UserStoreMiddleware]));
app.use(express.json());
app.use(cookieParser());

app.use(useController([AuthController, UserController, TodoController]));

app.use(useMiddleware([NotFoundHandlerMiddleware]));
app.use(useFilter([ExceptionFilter]));

db.connect().then(() =>
  app.listen(config.PORT, () =>
    console.log(`Server is listening on port ${config.PORT}, ${config.ENV}`)
  )
);
