import UserRepository from "../database/repositories/user.repository.js";
import Inject from "../decorators/inject.decorator.js";
import Injectable from "../decorators/injectable.decorator.js";
import { LoginDto } from "../dto/auth.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import PasswordService from "../services/password.service.js";
import TokenService from "../services/token.service.js";
import { IRepository, IUser } from "../types/database.types.js";

@Injectable()
export default class AuthService {
  @Inject(UserRepository) protected userRepository: IRepository<IUser>;
  @Inject(TokenService) protected tokenService: TokenService;
  @Inject(PasswordService) protected passwordService: PasswordService;

  get config() {
    return {
      cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * this.tokenService.config.refreshTokenMaxAge,
      },
    } as const;
  }

  async login({ email, password }: LoginDto) {
    const foundUser = await this.userRepository.findOne({ email });

    if (
      !foundUser ||
      !(await this.passwordService.compare(foundUser.password, password))
    ) {
      throw new HttpException(401);
    }

    return this.tokenService.create(foundUser.id);
  }

  refresh(jwt?: string) {
    return this.tokenService.refresh(jwt);
  }

  async logout(jwt?: string) {
    await this.tokenService.delete(jwt);
  }
}
