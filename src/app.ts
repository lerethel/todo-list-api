import config from "./config/config.js";
import AuthController from "./controllers/auth.controller.js";
import TodoController from "./controllers/todo.controller.js";
import UserController from "./controllers/user.controller.js";
import db from "./database/db.js";
import ExceptionFilter from "./filters/exception.filter.js";
import NotFoundHandlerMiddleware from "./middleware/not-found-handler.middleware.js";
import RateLimitMiddleware from "./middleware/rate-limit.middleware.js";
import UserStoreMiddleware from "./middleware/user-store.middleware.js";
import Server from "./server.js";
import Validator from "./validators/validator.js";

const app = new Server();

app.useValidator(Validator);
app.useMiddleware(RateLimitMiddleware, UserStoreMiddleware);
app.useController(AuthController, UserController, TodoController);
app.useMiddleware(NotFoundHandlerMiddleware);
app.useFilter(ExceptionFilter);

db.connect().then(() => app.listen(config.PORT));
