import todoRepository from "../database/repositories/todo.repository.js";
import tokenRepository from "../database/repositories/token.repository.js";
import userRepository from "../database/repositories/user.repository.js";
import {
  CreateUserDto,
  DeleteUserDto,
  UpdateUserEmailDto,
  UpdateUserNameDto,
  UpdateUserPasswordDto,
} from "../dto/user.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import passwordService from "../services/password.service.js";
import userStore from "../stores/user.store.js";
import { IRepository, ITodo, IToken, IUser } from "../types/database.types.js";

class UserService {
  constructor(
    private readonly userRepo: IRepository<IUser> = userRepository,
    private readonly todoRepo: IRepository<ITodo> = todoRepository,
    private readonly tokenRepo: IRepository<IToken> = tokenRepository
  ) {}

  async create({ name, email, password }: CreateUserDto) {
    await this.userRepo.create({
      name,
      email,
      password: await passwordService.hash(password),
    });
  }

  async find() {
    const user = userStore.get();
    const foundUser = await this.userRepo.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    return { name: foundUser.name, email: foundUser.email };
  }

  async updateName({ name }: UpdateUserNameDto) {
    const user = userStore.get();
    const foundUser = await this.userRepo.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    await this.userRepo.update({ id: user }, { name });
  }

  async updateEmail({ email, password }: UpdateUserEmailDto) {
    const user = userStore.get();
    const foundUser = await this.userRepo.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    if (!(await passwordService.compare(foundUser.password, password))) {
      throw new HttpException(400);
    }

    await this.userRepo.update({ id: user }, { email });
  }

  async updatePassword({
    password,
    "new-password": newPassword,
  }: UpdateUserPasswordDto) {
    const user = userStore.get();
    const foundUser = await this.userRepo.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    if (!(await passwordService.compare(foundUser.password, password))) {
      throw new HttpException(400);
    }

    await this.userRepo.update(
      { id: user },
      { password: await passwordService.hash(newPassword) }
    );
  }

  async delete({ password }: DeleteUserDto) {
    const user = userStore.get();
    const foundUser = await this.userRepo.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    if (!(await passwordService.compare(foundUser.password, password))) {
      throw new HttpException(400);
    }

    // Delete the user and all their data.
    await Promise.all([
      this.userRepo.deleteOne({ id: user }),
      this.todoRepo.deleteAll({ user }),
      this.tokenRepo.deleteAll({ user }),
    ]);
  }
}

export default new UserService();
