import Controller from "../decorators/controller.decorator.js";
import Inject from "../decorators/inject.decorator.js";
import { Get, Post } from "../decorators/route.decorators.js";
import Status from "../decorators/status.decorator.js";
import Validated from "../decorators/validated.decorator.js";
import AuthService from "../services/auth.service.js";
import { ControllerMethodContext } from "../types/common.types.js";
import { IAuthService } from "../types/service.types.js";
import * as validate from "../validators/validate.js";

@Controller("/auth")
export default class AuthController {
  @Inject(AuthService)
  protected readonly authService: IAuthService;

  @Validated([validate.userEmail, validate.userPassword])
  @Status(200)
  @Post("/login")
  async login({ body, res }: ControllerMethodContext) {
    const { accessToken, refreshToken } = await this.authService.login(body);
    res.cookie("jwt", refreshToken, this.authService.config.cookieOptions);
    return { token: accessToken };
  }

  @Get("/refresh")
  async refresh({ cookies: { jwt }, res }: ControllerMethodContext) {
    const { accessToken, refreshToken } = await this.authService.refresh(jwt);
    res.cookie("jwt", refreshToken, this.authService.config.cookieOptions);
    return { token: accessToken };
  }

  @Status(204)
  @Post("/logout")
  async logout({ cookies: { jwt }, res }: ControllerMethodContext) {
    await this.authService.logout(jwt);
    res.clearCookie("jwt", this.authService.config.cookieOptions);
  }
}
