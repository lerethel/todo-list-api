import { LoginDto } from "../dto/auth.dto.js";
import { HttpException } from "../exceptions/http.exception.js";
import User from "../models/user.model.js";
import passwordService from "../services/password.service.js";
import tokenService from "../services/token.service.js";

class AuthService {
  readonly config = {
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * tokenService.config.refreshTokenMaxAge,
    },
  } as const;

  async login({ email, password }: LoginDto) {
    const foundUser = await User.findOne({ email }).lean().exec();

    if (
      !foundUser ||
      !(await passwordService.compare(foundUser.password, password))
    ) {
      throw new HttpException(401);
    }

    return tokenService.create(foundUser._id.toString());
  }

  refresh(jwt?: string) {
    return tokenService.refresh(jwt);
  }

  async logout(jwt?: string) {
    await tokenService.delete(jwt);
  }
}

export default new AuthService();
