import { CookieOptions } from "express";
import ResourceToken from "../config/enums/resource-token.enum.js";
import { LoginUserDto } from "../dto/auth.dto.js";
import {
  CreateTodoDto,
  CreateTodoReturnDto,
  FindTodoDto,
  FindTodoReturnDto,
  UpdateTodoReturnDto,
} from "../dto/todo.dto.js";
import { CreateTokenReturnDto } from "../dto/token.dto.js";
import {
  CreateUserDto,
  DeleteUserDto,
  FindUserReturnDto,
  UpdateUserEmailDto,
  UpdateUserNameDto,
  UpdateUserPasswordDto,
} from "../dto/user.dto.js";

export type IAuthServiceConfig = {
  readonly cookieOptions: Readonly<CookieOptions>;
};

export type ITokenServiceConfig = {
  readonly accessTokenMaxAge: number;
  readonly refreshTokenMaxAge: number;
};

export interface IAuthService {
  get config(): IAuthServiceConfig;
  login(dto: LoginUserDto): Promise<CreateTokenReturnDto>;
  refresh(jwt?: string): Promise<CreateTokenReturnDto>;
  logout(jwt?: string): Promise<void>;
}

export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(storedPassword: string, suppliedPassword: string): Promise<boolean>;
}

export interface ITodoService {
  create(dto: CreateTodoDto): Promise<CreateTodoReturnDto>;
  find(dto: FindTodoDto): Promise<FindTodoReturnDto>;
  update(id: unknown, dto: CreateTodoDto): Promise<UpdateTodoReturnDto>;
  delete(id: unknown): Promise<void>;
}

export interface ITokenService {
  get config(): ITokenServiceConfig;
  create(user: unknown): Promise<CreateTokenReturnDto>;
  refresh(refreshToken?: string): Promise<CreateTokenReturnDto>;
  delete(refreshToken?: string): Promise<void>;
}

export interface IUserStoreService {
  get(): unknown;
}

export interface IUserService {
  create(dto: CreateUserDto): Promise<void>;
  find(): Promise<FindUserReturnDto>;
  updateName(dto: UpdateUserNameDto): Promise<void>;
  updateEmail(dto: UpdateUserEmailDto): Promise<void>;
  updatePassword(dto: UpdateUserPasswordDto): Promise<void>;
  delete(dto: DeleteUserDto): Promise<void>;
}

export interface IResourceService {
  find(token: ResourceToken): Promise<string | undefined>;
}
