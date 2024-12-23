import verifyAccessMiddleware from "../middleware/verify-access.middleware.js";
import todoService from "../services/todo.service.js";
import { ValidatedHandler } from "../types/common.types.js";
import * as validate from "../utils/validate.js";

class TodoController {
  create: ValidatedHandler = [
    verifyAccessMiddleware,
    validate.todoTitle,
    validate.todoDescription,
    validate.sendErrorsIfExist,
    async ({ body }, res) => {
      res.status(201).json(await todoService.create(body));
    },
  ];

  find: ValidatedHandler = [
    verifyAccessMiddleware,
    validate.todoPageQuery,
    validate.todoLimitQuery,
    validate.todoSortQuery,
    validate.todoDateQuery,
    validate.sendErrorsIfExist,
    async ({ query }, res) => {
      res.json(
        await todoService.find({
          ...query,
          page: +query.page!,
          limit: +query.limit!,
        })
      );
    },
  ];

  update: ValidatedHandler = [
    verifyAccessMiddleware,
    validate.todoTitle,
    validate.todoDescription,
    validate.todoIdParam,
    validate.sendErrorsIfExist,
    async ({ params: { id }, body }, res) => {
      res.status(200).json(await todoService.update(id, body));
    },
  ];

  delete: ValidatedHandler = [
    verifyAccessMiddleware,
    validate.todoIdParam,
    validate.sendErrorsIfExist,
    async ({ params: { id } }, res) => {
      await todoService.delete(id);
      res.jsonStatus(204);
    },
  ];
}

export default new TodoController();
