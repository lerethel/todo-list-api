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
import * as validate from "../validators/validate.js";

@Controller("/auth")
export default class AuthController {
  @Inject(AuthService)
  protected readonly authService: IAuthService;

  @Validated([validate.userEmail, validate.userPassword])
  @Status(200)
  @Bind(Body(), Res())
  @Post("/login")
  async login(dto: LoginUserDto, res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    res.cookie("jwt", refreshToken, this.authService.config.cookieOptions);
    return { token: accessToken };
  }

  @Bind(Cookies("jwt"), Res())
  @Get("/refresh")
  async refresh(jwt: string, res: Response) {
    const { accessToken, refreshToken } = await this.authService.refresh(jwt);
    res.cookie("jwt", refreshToken, this.authService.config.cookieOptions);
    return { token: accessToken };
  }

  @Status(204)
  @Bind(Cookies("jwt"), Res())
  @Post("/logout")
  async logout(jwt: string, res: Response) {
    await this.authService.logout(jwt);
    res.clearCookie("jwt", this.authService.config.cookieOptions);
  }
}
