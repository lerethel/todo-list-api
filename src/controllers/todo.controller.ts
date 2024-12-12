import { FindTodoDto } from "../dto/todo.dto.js";
import { verifyAccess } from "../middleware/verify-access.middleware.js";
import todoService from "../services/todo.service.js";
import { ValidatedHandler } from "../types/types.js";
import * as validate from "../utils/validate.js";

class TodoController {
  create: ValidatedHandler = [
    verifyAccess,
    validate.todoTitle,
    validate.todoDescription,
    validate.sendErrorsIfExist,
    async ({ user, body }, res) => {
      res.status(201).json(await todoService.create(user!, body));
    },
  ];

  find: ValidatedHandler = [
    verifyAccess,
    validate.todoPageQuery,
    validate.todoLimitQuery,
    validate.todoSortQuery,
    validate.todoDateQuery,
    validate.sendErrorsIfExist,
    async ({ user, query }, res) => {
      res.json(
        await todoService.find(user!, query as unknown as FindTodoDto)
      );
    },
  ];

  update: ValidatedHandler = [
    verifyAccess,
    validate.todoTitle,
    validate.todoDescription,
    validate.todoIdParam,
    validate.sendErrorsIfExist,
    async ({ user, params: { id }, body }, res) => {
      res.status(200).json(await todoService.update(user!, id, body));
    },
  ];

  delete: ValidatedHandler = [
    verifyAccess,
    validate.todoIdParam,
    validate.sendErrorsIfExist,
    async ({ user, params: { id } }, res) => {
      await todoService.delete(user!, id);
      res.jsonStatus(204);
    },
  ];
}

export default new TodoController();
