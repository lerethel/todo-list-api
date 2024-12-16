import todoModel from "../models/todo.model.js";
import { ITodo } from "../types/database.types.js";
import Repository from "./repository.js";

class TodoRepository extends Repository<ITodo> {}

export default new TodoRepository(todoModel);
