import UserRepository from "../database/repositories/user.repository.js";
import Inject from "../decorators/inject.decorator.js";
import Injectable from "../decorators/injectable.decorator.js";
import { LoginUserDto } from "../dto/auth.dto.js";
import { CreateTokenReturnDto } from "../dto/token.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import PasswordService from "../services/password.service.js";
import TokenService from "../services/token.service.js";
import { IRepository, IUser } from "../types/database.types.js";
import {
  IAuthService,
  IAuthServiceConfig,
  IPasswordService,
  ITokenService,
} from "../types/service.types.js";

@Injectable()
export default class AuthService implements IAuthService {
  @Inject(UserRepository)
  protected readonly userRepository: IRepository<IUser>;

  @Inject(TokenService)
  protected readonly tokenService: ITokenService;

  @Inject(PasswordService)
  protected readonly passwordService: IPasswordService;

  get config(): IAuthServiceConfig {
    return {
      cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * this.tokenService.config.refreshTokenMaxAge,
      },
    } as const;
  }

  async login({
    email,
    password,
  }: LoginUserDto): Promise<CreateTokenReturnDto> {
    const foundUser = await this.userRepository.findOne({ email });

    if (
      !foundUser ||
      !(await this.passwordService.compare(foundUser.password, password))
    ) {
      throw new HttpException(401, "auth.wrong-credentials");
    }

    return this.tokenService.create(foundUser.id);
  }

  refresh(jwt?: string): Promise<CreateTokenReturnDto> {
    return this.tokenService.refresh(jwt);
  }

  async logout(jwt?: string): Promise<void> {
    await this.tokenService.delete(jwt);
  }
}
