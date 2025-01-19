import cookieParser from "cookie-parser";
import express from "express";
import config from "./config/config.js";
import useController from "./controllers/core/use-controller.js";
import useFilter from "./filters/core/use-filter.js";
import useMiddleware from "./middleware/core/use-middleware.js";
import statusMessages from "./utils/status-messages.js";

// A replacement for res.sendStatus() that sends a JSON object in the validation
// failure format used throughout the project (i.e., as an array of objects).
express.response.jsonStatus = function (code) {
  return this.status(code).json([{ message: statusMessages[code] ?? "" }]);
};

type Controllers = Parameters<typeof useController>;
type Middleware = Parameters<typeof useMiddleware>;
type Filters = Parameters<typeof useFilter>;

export default class Server {
  constructor(private readonly app = express()) {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  useController(...controllers: Controllers) {
    this.app.use(useController(...controllers));
  }

  useMiddleware(...middleware: Middleware) {
    this.app.use(useMiddleware(...middleware));
  }

  useFilter(...filters: Filters) {
    this.app.use(useFilter(...filters));
  }

  listen(port: number) {
    this.app.listen(port, () =>
      console.log(`Server is listening on port ${port}, ${config.ENV}`)
    );
  }
}
