import { LoginDto } from "../dto/auth.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import userRepository from "../repositories/user.repository.js";
import passwordService from "../services/password.service.js";
import tokenService from "../services/token.service.js";
import { IRepository, IUser } from "../types/database.types.js";

class AuthService {
  constructor(private readonly userRepo: IRepository<IUser> = userRepository) {}

  readonly config = {
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * tokenService.config.refreshTokenMaxAge,
    },
  } as const;

  async login({ email, password }: LoginDto) {
    const foundUser = await this.userRepo.findOne({ email });

    if (
      !foundUser ||
      !(await passwordService.compare(foundUser.password, password))
    ) {
      throw new HttpException(401);
    }

    return tokenService.create(foundUser.id as string);
  }

  refresh(jwt?: string) {
    return tokenService.refresh(jwt);
  }

  async logout(jwt?: string) {
    await tokenService.delete(jwt);
  }
}

export default new AuthService();
