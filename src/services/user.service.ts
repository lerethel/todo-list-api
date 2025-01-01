import TodoRepository from "../database/repositories/todo.repository.js";
import TokenRepository from "../database/repositories/token.repository.js";
import UserRepository from "../database/repositories/user.repository.js";
import Inject from "../decorators/inject.decorator.js";
import Injectable from "../decorators/injectable.decorator.js";
import {
  CreateUserDto,
  DeleteUserDto,
  UpdateUserEmailDto,
  UpdateUserNameDto,
  UpdateUserPasswordDto,
} from "../dto/user.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import PasswordService from "../services/password.service.js";
import { IRepository, ITodo, IToken, IUser } from "../types/database.types.js";
import UserStoreService from "./user-store.service.js";

@Injectable()
export default class UserService {
  @Inject(UserRepository) protected userRepository: IRepository<IUser>;
  @Inject(TodoRepository) protected todoRepository: IRepository<ITodo>;
  @Inject(TokenRepository) protected tokenRepository: IRepository<IToken>;
  @Inject(PasswordService) protected passwordService: PasswordService;
  @Inject(UserStoreService) protected userStoreService: UserStoreService;

  async create({ name, email, password }: CreateUserDto) {
    if (await this.userRepository.findOne({ email })) {
      throw new HttpException(409, "User already exists.");
    }

    await this.userRepository.create({
      name,
      email,
      password: await this.passwordService.hash(password),
    });
  }

  async find() {
    const user = this.userStoreService.get();
    const foundUser = await this.userRepository.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    return { name: foundUser.name, email: foundUser.email };
  }

  async updateName({ name }: UpdateUserNameDto) {
    const user = this.userStoreService.get();
    const foundUser = await this.userRepository.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    await this.userRepository.update({ id: user }, { name });
  }

  async updateEmail({ email, password }: UpdateUserEmailDto) {
    const user = this.userStoreService.get();
    const userByEmail = await this.userRepository.findOne({ email });

    if (userByEmail && userByEmail.id !== user) {
      throw new HttpException(409, "User already exists.");
    }

    const foundUser =
      // Reuse the found record if it's the same user.
      userByEmail?.id === user
        ? userByEmail
        : await this.userRepository.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    if (!(await this.passwordService.compare(foundUser.password, password))) {
      throw new HttpException(400);
    }

    await this.userRepository.update({ id: user }, { email });
  }

  async updatePassword({
    password,
    "new-password": newPassword,
  }: UpdateUserPasswordDto) {
    const user = this.userStoreService.get();
    const foundUser = await this.userRepository.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    if (!(await this.passwordService.compare(foundUser.password, password))) {
      throw new HttpException(400);
    }

    await this.userRepository.update(
      { id: user },
      { password: await this.passwordService.hash(newPassword) }
    );
  }

  async delete({ password }: DeleteUserDto) {
    const user = this.userStoreService.get();
    const foundUser = await this.userRepository.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    if (!(await this.passwordService.compare(foundUser.password, password))) {
      throw new HttpException(400);
    }

    // Delete the user and all their data.
    await Promise.all([
      this.userRepository.deleteOne({ id: user }),
      this.todoRepository.deleteAll({ user }),
      this.tokenRepository.deleteAll({ user }),
    ]);
  }
}
