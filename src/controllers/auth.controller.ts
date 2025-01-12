import { Response } from "express";
import Bind, { Body, Cookies, Res } from "../decorators/bind.decorator.js";
import Controller from "../decorators/controller.decorator.js";
import Inject from "../decorators/inject.decorator.js";
import { Get, Post } from "../decorators/route.decorators.js";
import Status from "../decorators/status.decorator.js";
import Validated from "../decorators/validated.decorator.js";
import { LoginUserDto } from "../dto/auth.dto.js";
import AuthService from "../services/auth.service.js";
import { IAuthService } from "../types/service.types.js";
import StatusCode from "../utils/enums/status-code.enum.js";
import * as validate from "../validators/validate.js";

@Controller("/auth")
export default class AuthController {
  @Inject(AuthService)
  protected readonly authService: IAuthService;

  @Validated(validate.userEmail, validate.userPassword)
  @Status(StatusCode.OK)
  @Post("/login")
  @Bind(Body(), Res())
  async login(dto: LoginUserDto, res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    res.cookie("jwt", refreshToken, this.authService.config.cookieOptions);
    return { token: accessToken };
  }

  @Get("/refresh")
  @Bind(Cookies("jwt"), Res())
  async refresh(jwt: string, res: Response) {
    const { accessToken, refreshToken } = await this.authService.refresh(jwt);
    res.cookie("jwt", refreshToken, this.authService.config.cookieOptions);
    return { token: accessToken };
  }

  @Status(StatusCode.NoContent)
  @Post("/logout")
  @Bind(Cookies("jwt"), Res())
  async logout(jwt: string, res: Response) {
    await this.authService.logout(jwt);
    res.clearCookie("jwt", this.authService.config.cookieOptions);
  }
}
