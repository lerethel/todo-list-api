import { Request, Response } from "express";
import Controller from "../decorators/controller.decorator.js";
import Protected from "../decorators/protected.decorator.js";
import { Delete, Get, Post, Put } from "../decorators/route.decorators.js";
import Validated from "../decorators/validated.decorator.js";
import todoService from "../services/todo.service.js";
import * as validate from "../validators/validate.js";

@Controller("/todos")
export default class TodoController {
  @Validated([validate.todoTitle, validate.todoDescription])
  @Protected
  @Post("/")
  async create({ body }: Request, res: Response) {
    res.status(201).json(await todoService.create(body));
  }

  @Validated([
    validate.todoPageQuery,
    validate.todoLimitQuery,
    validate.todoSortQuery,
    validate.todoDateQuery,
  ])
  @Protected
  @Get("/")
  async find({ query }: Request, res: Response) {
    res.json(
      await todoService.find({
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
  @Protected
  @Put("/:id")
  async update({ params: { id }, body }: Request, res: Response) {
    res.status(200).json(await todoService.update(id, body));
  }

  @Validated([validate.todoIdParam])
  @Protected
  @Delete("/:id")
  async delete({ params: { id } }: Request, res: Response) {
    await todoService.delete(id);
    res.jsonStatus(204);
  }
}
