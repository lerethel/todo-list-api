import { Request, Response } from "express";
import Controller from "../decorators/controller.decorator.js";
import Inject from "../decorators/inject.decorator.js";
import Protected from "../decorators/protected.decorator.js";
import { Delete, Get, Post, Put } from "../decorators/route.decorators.js";
import Validated from "../decorators/validated.decorator.js";
import TodoService from "../services/todo.service.js";
import { ITodoService } from "../types/service.types.js";
import * as validate from "../validators/validate.js";

@Protected()
@Controller("/todo")
export default class TodoController {
  @Inject(TodoService)
  protected readonly todoService: ITodoService;

  @Validated([validate.todoTitle, validate.todoDescription])
  @Post("/")
  async create({ body }: Request, res: Response) {
    res.status(201).json(await this.todoService.create(body));
  }

  @Validated([
    validate.todoPageQuery,
    validate.todoLimitQuery,
    validate.todoSortQuery,
    validate.todoDateQuery,
  ])
  @Get("/")
  async find({ query }: Request, res: Response) {
    res.json(
      await this.todoService.find({
        ...query,
        page: +query.page!,
        limit: +query.limit!,
      })
    );
  }

  @Validated([
    validate.todoTitle,
    validate.todoDescription,
    validate.todoIdParam,
  ])
  @Put("/:id")
  async update({ params: { id }, body }: Request, res: Response) {
    res.status(200).json(await this.todoService.update(id, body));
  }

  @Validated([validate.todoIdParam])
  @Delete("/:id")
  async delete({ params: { id } }: Request, res: Response) {
    await this.todoService.delete(id);
    res.jsonStatus(204);
  }
}
