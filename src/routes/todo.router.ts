import express from "express";
import * as todoController from "../controllers/todo.controller.js";

const router = express.Router();

router
  .route("/todos")
  .post(todoController.createTodo)
  .get(todoController.getTodos);

router
  .route("/todos/:id")
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo);

export default router;
