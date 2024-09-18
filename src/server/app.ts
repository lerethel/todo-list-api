import type { ErrorRequestHandler } from "express";

import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import todoRouter from "./routes/todo.js";
import userRouter from "./routes/user.js";
import { verifyAccess } from "./utils/token.js";

const port = process.env.PORT || 3000;

const app = express();
mongoose.connect("mongodb://localhost:27017/todo-list");

app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(verifyAccess);
app.use(todoRouter);

app.use(<ErrorRequestHandler>((err: Error, req, res, next) => {
  console.error(err.stack);
  res.sendStatus(500);
}));

app.listen(port, () => console.log(`Server is listening on port ${port}`));
