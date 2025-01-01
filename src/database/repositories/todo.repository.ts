import Injectable from "../../decorators/injectable.decorator.js";
import { ITodo } from "../../types/database.types.js";
import todoModel from "../models/todo.model.js";
import Repository from "./repository.js";

@Injectable(todoModel)
export default class TodoRepository extends Repository<ITodo> {}
