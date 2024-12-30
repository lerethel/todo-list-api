import { Request, Response } from "express";
import Controller from "../decorators/controller.decorator.js";
import Protected from "../decorators/protected.decorator.js";
import { Delete, Get, Post, Put } from "../decorators/route.decorators.js";
import Validated from "../decorators/validated.decorator.js";
import userService from "../services/user.service.js";
import * as validate from "../validators/validate.js";

@Protected()
@Controller("/user")
export default class UserController {
  @Validated([validate.userName, validate.userEmail, validate.userPassword])
  @Protected({ excluded: true })
  @Post("/")
  async create({ body }: Request, res: Response) {
    await userService.create(body);
    res.jsonStatus(201);
  }

  @Get("/")
  async find(req: Request, res: Response) {
    res.status(200).json(await userService.find());
  }

  @Validated([validate.userName])
  @Put("/name")
  async updateName({ body }: Request, res: Response) {
    await userService.updateName(body);
    res.jsonStatus(200);
  }

  @Validated([validate.userEmail, validate.userPassword])
  @Put("/email")
  async updateEmail({ body }: Request, res: Response) {
    await userService.updateEmail(body);
    res.jsonStatus(200);
  }

  @Validated([validate.userPasswordOnUpdate, validate.userNewPassword])
  @Put("/password")
  async updatePassword({ body }: Request, res: Response) {
    await userService.updatePassword(body);
    res.jsonStatus(200);
  }

  @Validated([validate.userPassword])
  @Delete("/")
  async delete({ body }: Request, res: Response) {
    await userService.delete(body);
    res.jsonStatus(204);
  }
}
