import { Router } from "express";
import todoController from "../controllers/todo.controller.js";

const todoRouter = Router();

todoRouter.route("/todos").post(todoController.create).get(todoController.find);

todoRouter
  .route("/todos/:id")
  .put(todoController.update)
  .delete(todoController.delete);

export default todoRouter;
