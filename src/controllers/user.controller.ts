import Controller from "../decorators/controller.decorator.js";
import Inject from "../decorators/inject.decorator.js";
import Protected from "../decorators/protected.decorator.js";
import { Delete, Get, Post, Put } from "../decorators/route.decorators.js";
import Validated from "../decorators/validated.decorator.js";
import UserService from "../services/user.service.js";
import { ControllerMethodContext } from "../types/common.types.js";
import { IUserService } from "../types/service.types.js";
import * as validate from "../validators/validate.js";

@Protected()
@Controller("/user")
export default class UserController {
  @Inject(UserService)
  protected readonly userService: IUserService;

  @Validated([validate.userName, validate.userEmail, validate.userPassword])
  @Protected({ excluded: true })
  @Post("/")
  async create({ body }: ControllerMethodContext) {
    await this.userService.create(body);
  }

  @Get("/")
  find() {
    return this.userService.find();
  }

  @Validated([validate.userName])
  @Put("/name")
  async updateName({ body }: ControllerMethodContext) {
    await this.userService.updateName(body);
  }

  @Validated([validate.userEmail, validate.userPassword])
  @Put("/email")
  async updateEmail({ body }: ControllerMethodContext) {
    await this.userService.updateEmail(body);
  }

  @Validated([validate.userPasswordOnUpdate, validate.userNewPassword])
  @Put("/password")
  async updatePassword({ body }: ControllerMethodContext) {
    await this.userService.updatePassword(body);
  }

  @Validated([validate.userPassword])
  @Delete("/")
  async delete({ body }: ControllerMethodContext) {
    await this.userService.delete(body);
  }
}
