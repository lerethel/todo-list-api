import cookieParser from "cookie-parser";
import express from "express";
import config from "./config/config.js";
import AuthController from "./controllers/auth.controller.js";
import TodoController from "./controllers/todo.controller.js";
import UserController from "./controllers/user.controller.js";
import db from "./database/db.js";
import errorHandlerMiddleware from "./middleware/error-handler.middleware.js";
import notFoundHandlerMiddleware from "./middleware/not-found-handler.middleware.js";
import rateLimitMiddleware from "./middleware/rate-limit.middleware.js";
import userStoreMiddleware from "./middleware/user-store.middleware.js";
import coreRouter from "./routes/core.router.js";
import statusCodes from "./utils/status-codes.js";

// A replacement for res.sendStatus() that sends a JSON object in the validation
// failure format used throughout the project (i.e., as an array of objects).
express.response.jsonStatus = function (code) {
  return this.status(code).json([{ message: statusCodes[code] ?? "" }]);
};

const app = express();

app.use(rateLimitMiddleware);
app.use(userStoreMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use(coreRouter([AuthController, UserController, TodoController]));

app.use(notFoundHandlerMiddleware);
app.use(errorHandlerMiddleware);

db.connect().then(() =>
  app.listen(config.PORT, () =>
    console.log(`Server is listening on port ${config.PORT}`)
  )
);
