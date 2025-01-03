import Controller from "../decorators/controller.decorator.js";
import Inject from "../decorators/inject.decorator.js";
import Protected from "../decorators/protected.decorator.js";
import { Delete, Get, Post, Put } from "../decorators/route.decorators.js";
import Validated from "../decorators/validated.decorator.js";
import TodoService from "../services/todo.service.js";
import { ControllerMethodContext } from "../types/common.types.js";
import { ITodoService } from "../types/service.types.js";
import * as validate from "../validators/validate.js";

@Protected()
@Controller("/todo")
export default class TodoController {
  @Inject(TodoService)
  protected readonly todoService: ITodoService;

  @Validated([validate.todoTitle, validate.todoDescription])
  @Post("/")
  create({ body }: ControllerMethodContext) {
    return this.todoService.create(body);
  }

  @Validated([
    validate.todoPageQuery,
    validate.todoLimitQuery,
    validate.todoSortQuery,
    validate.todoDateQuery,
  ])
  @Get("/")
  find({ query }: ControllerMethodContext) {
    return this.todoService.find({
      ...query,
      page: +query.page!,
      limit: +query.limit!,
    });
  }

  @Validated([
    validate.todoTitle,
    validate.todoDescription,
    validate.todoIdParam,
  ])
  @Put("/:id")
  update({ params: { id }, body }: ControllerMethodContext) {
    return this.todoService.update(id, body);
  }

  @Validated([validate.todoIdParam])
  @Delete("/:id")
  async delete({ params: { id } }: ControllerMethodContext) {
    await this.todoService.delete(id);
  }
}
