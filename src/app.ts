import cookieParser from "cookie-parser";
import express, { ErrorRequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import { HttpException } from "./exceptions/http.exception.js";
import todoRouter from "./routes/todo.router.js";
import userRouter from "./routes/user.router.js";
import userStore from "./stores/user.store.js";
import statusCodes from "./utils/status-codes.js";

// A replacement for res.sendStatus() that sends a JSON object in the validation
// failure format used throughout the project (i.e., as an array of objects).
express.response.jsonStatus = function (code) {
  return this.status(code).json([{ message: statusCodes[code] ?? "" }]);
};

const port = process.env.PORT || 3000;

const app = express();
mongoose.connect(process.env.MONGODB_URI);

app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: process.env.NODE_ENV === "production" ? 30 : 500,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res, next, { statusCode, message }) =>
      res.status(statusCode).json([{ message }]),
  })
);
app.use((req, res, next) => userStore.init(next));
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(todoRouter);

app.use((req, res) => res.jsonStatus(404));

app.use(((err: Error | HttpException, req, res, next) => {
  if (err instanceof HttpException) {
    return res.jsonStatus(err.status);
  }

  console.error(err.stack);
  res.jsonStatus(500);
}) as ErrorRequestHandler);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
