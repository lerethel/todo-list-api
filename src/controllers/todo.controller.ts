import Bind, { Body, Params, Query } from "../decorators/bind.decorator.js";
import Controller from "../decorators/controller.decorator.js";
import Inject from "../decorators/inject.decorator.js";
import Protected from "../decorators/protected.decorator.js";
import { Delete, Get, Post, Put } from "../decorators/route.decorators.js";
import Validated from "../decorators/validated.decorator.js";
import { CreateTodoDto, FindTodoDto } from "../dto/todo.dto.js";
import TodoService from "../services/todo.service.js";
import { ITodoService } from "../types/service.types.js";
import * as validate from "../validators/validate.js";

@Protected()
@Controller("/todo")
export default class TodoController {
  @Inject(TodoService)
  protected readonly todoService: ITodoService;

  @Validated([validate.todoTitle, validate.todoDescription])
  @Bind(Body())
  @Post("/")
  create(dto: CreateTodoDto) {
    return this.todoService.create(dto);
  }

  @Validated([
    validate.todoPageQuery,
    validate.todoLimitQuery,
    validate.todoSortQuery,
    validate.todoDateQuery,
  ])
  @Bind(Query())
  @Get("/")
  find(dto: FindTodoDto) {
    return this.todoService.find({
      ...dto,
      page: +dto.page,
      limit: +dto.limit,
    });
  }

  @Validated([
    validate.todoTitle,
    validate.todoDescription,
    validate.todoIdParam,
  ])
  @Bind(Params("id"), Body())
  @Put("/:id")
  update(id: unknown, dto: CreateTodoDto) {
    return this.todoService.update(id, dto);
  }

  @Validated([validate.todoIdParam])
  @Bind(Params("id"))
  @Delete("/:id")
  async delete(id: unknown) {
    await this.todoService.delete(id);
  }
}
