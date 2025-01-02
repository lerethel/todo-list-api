import { Request, Response } from "express";
import Controller from "../decorators/controller.decorator.js";
import Inject from "../decorators/inject.decorator.js";
import { Get, Post } from "../decorators/route.decorators.js";
import Validated from "../decorators/validated.decorator.js";
import AuthService from "../services/auth.service.js";
import * as validate from "../validators/validate.js";

@Controller("/auth")
export default class AuthController {
  @Inject(AuthService)
  protected readonly authService: AuthService;

  @Validated([validate.userEmail, validate.userPassword])
  @Post("/login")
  async login({ body }: Request, res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(body);
    res.cookie("jwt", refreshToken, this.authService.config.cookieOptions);
    res.json({ token: accessToken });
  }

  @Get("/refresh")
  async refresh({ cookies: { jwt } }: Request, res: Response) {
    const { accessToken, refreshToken } = await this.authService.refresh(jwt);
    res.cookie("jwt", refreshToken, this.authService.config.cookieOptions);
    res.json({ token: accessToken });
  }

  @Post("/logout")
  async logout({ cookies: { jwt } }: Request, res: Response) {
    await this.authService.logout(jwt);
    res.clearCookie("jwt", this.authService.config.cookieOptions);
    res.jsonStatus(204);
  }
}
