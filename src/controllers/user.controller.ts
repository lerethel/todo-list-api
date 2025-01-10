import Bind, { Body } from "../decorators/bind.decorator.js";
import Controller from "../decorators/controller.decorator.js";
import Inject from "../decorators/inject.decorator.js";
import Protected from "../decorators/protected.decorator.js";
import { Delete, Get, Post, Put } from "../decorators/route.decorators.js";
import Validated from "../decorators/validated.decorator.js";
import {
  CreateUserDto,
  DeleteUserDto,
  UpdateUserEmailDto,
  UpdateUserNameDto,
  UpdateUserPasswordDto,
} from "../dto/user.dto.js";
import UserService from "../services/user.service.js";
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
  @Bind(Body())
  async create(dto: CreateUserDto) {
    await this.userService.create(dto);
  }

  @Get("/")
  find() {
    return this.userService.find();
  }

  @Validated([validate.userName])
  @Put("/name")
  @Bind(Body())
  async updateName(dto: UpdateUserNameDto) {
    await this.userService.updateName(dto);
  }

  @Validated([validate.userEmail, validate.userPassword])
  @Put("/email")
  @Bind(Body())
  async updateEmail(dto: UpdateUserEmailDto) {
    await this.userService.updateEmail(dto);
  }

  @Validated([validate.userPasswordOnUpdate, validate.userNewPassword])
  @Put("/password")
  @Bind(Body())
  async updatePassword(dto: UpdateUserPasswordDto) {
    await this.userService.updatePassword(dto);
  }

  @Validated([validate.userPassword])
  @Delete("/")
  @Bind(Body())
  async delete(dto: DeleteUserDto) {
    await this.userService.delete(dto);
  }
}
