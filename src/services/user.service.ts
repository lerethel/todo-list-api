import TodoRepository from "../database/repositories/todo.repository.js";
import TokenRepository from "../database/repositories/token.repository.js";
import UserRepository from "../database/repositories/user.repository.js";
import Inject from "../decorators/inject.decorator.js";
import Injectable from "../decorators/injectable.decorator.js";
import {
  CreateUserDto,
  DeleteUserDto,
  FindUserReturnDto,
  UpdateUserEmailDto,
  UpdateUserNameDto,
  UpdateUserPasswordDto,
} from "../dto/user.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import PasswordService from "../services/password.service.js";
import { IRepository, ITodo, IToken, IUser } from "../types/database.types.js";
import {
  IPasswordService,
  IUserService,
  IUserStoreService,
} from "../types/service.types.js";
import UserStoreService from "./user-store.service.js";

@Injectable()
export default class UserService implements IUserService {
  @Inject(UserRepository)
  protected readonly userRepository: IRepository<IUser>;

  @Inject(TodoRepository)
  protected readonly todoRepository: IRepository<ITodo>;

  @Inject(TokenRepository)
  protected readonly tokenRepository: IRepository<IToken>;

  @Inject(PasswordService)
  protected readonly passwordService: IPasswordService;

  @Inject(UserStoreService)
  protected readonly userStoreService: IUserStoreService;

  async create({ name, email, password }: CreateUserDto): Promise<void> {
    if (await this.userRepository.findOne({ email })) {
      throw new HttpException(409, "User already exists.");
    }

    await this.userRepository.create({
      name,
      email,
      password: await this.passwordService.hash(password),
    });
  }

  async find(): Promise<FindUserReturnDto> {
    const user = this.userStoreService.get();
    const foundUser = await this.userRepository.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    return { name: foundUser.name, email: foundUser.email };
  }

  async updateName({ name }: UpdateUserNameDto): Promise<void> {
    const user = this.userStoreService.get();
    const foundUser = await this.userRepository.findOne({ id: user });

    if (!foundUser) {
      throw new HttpException(404);
    }

    await this.userRepository.update({ id: user }, { name });
  }

  async updateEmail({ email, password }: UpdateUserEmailDto): Promise<void> {
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
  }: UpdateUserPasswordDto): Promise<void> {
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

  async delete({ password }: DeleteUserDto): Promise<void> {
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
