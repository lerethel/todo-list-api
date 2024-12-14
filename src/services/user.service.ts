import {
  CreateUserDto,
  DeleteUserDto,
  UpdateUserEmailDto,
  UpdateUserNameDto,
  UpdateUserPasswordDto,
} from "../dto/user.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import Todo from "../models/todo.model.js";
import Token from "../models/token.model.js";
import User from "../models/user.model.js";
import passwordService from "../services/password.service.js";
import userStore from "../stores/user.store.js";

class UserService {
  async create({ name, email, password }: CreateUserDto) {
    await User.create({
      name,
      email,
      password: await passwordService.hash(password),
    });
  }

  async find() {
    const user = userStore.get();
    const foundUser = await User.findById(user, "name email").lean().exec();

    if (!foundUser) {
      throw new HttpException(404);
    }

    return { name: foundUser.name, email: foundUser.email };
  }

  async updateName({ name }: UpdateUserNameDto) {
    const user = userStore.get();
    const foundUser = await User.findById(user, "name").exec();

    if (!foundUser) {
      throw new HttpException(404);
    }

    foundUser.name = name;
    await foundUser.save();
  }

  async updateEmail({ email, password }: UpdateUserEmailDto) {
    const user = userStore.get();
    const foundUser = await User.findById(user, "email password").exec();

    if (!foundUser) {
      throw new HttpException(404);
    }

    if (!(await passwordService.compare(foundUser.password, password))) {
      throw new HttpException(400);
    }

    foundUser.email = email;
    await foundUser.save();
  }

  async updatePassword({
    password,
    "new-password": newPassword,
  }: UpdateUserPasswordDto) {
    const user = userStore.get();
    const foundUser = await User.findById(user, "password").exec();

    if (!foundUser) {
      throw new HttpException(404);
    }

    if (!(await passwordService.compare(foundUser.password, password))) {
      throw new HttpException(400);
    }

    foundUser.password = await passwordService.hash(newPassword);
    await foundUser.save();
  }

  async delete({ password }: DeleteUserDto) {
    const user = userStore.get();
    const foundUser = await User.findById(user, "password").lean().exec();

    if (!foundUser) {
      throw new HttpException(404);
    }

    if (!(await passwordService.compare(foundUser.password, password))) {
      throw new HttpException(400);
    }

    // Delete the user and all their data.
    await Promise.all([
      User.deleteOne({ _id: user }).exec(),
      Todo.deleteMany({ user }).exec(),
      Token.deleteMany({ user }).exec(),
    ]);
  }
}

export default new UserService();
