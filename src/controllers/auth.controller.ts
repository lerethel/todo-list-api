import { Request, Response } from "express";
import Controller from "../decorators/controller.decorator.js";
import { Get, Post } from "../decorators/route.decorators.js";
import Validated from "../decorators/validated.decorator.js";
import authService from "../services/auth.service.js";
import * as validate from "../utils/validate.js";

@Controller("/users")
export default class AuthController {
  @Validated([validate.userEmail, validate.userPassword])
  @Post("/login")
  async login({ body }: Request, res: Response) {
    const { accessToken, refreshToken } = await authService.login(body);
    res.cookie("jwt", refreshToken, authService.config.cookieOptions);
    res.json({ token: accessToken });
  }

  @Get("/refresh")
  async refresh({ cookies: { jwt } }: Request, res: Response) {
    const { accessToken, refreshToken } = await authService.refresh(jwt);
    res.cookie("jwt", refreshToken, authService.config.cookieOptions);
    res.json({ token: accessToken });
  }

  @Post("/logout")
  async logout({ cookies: { jwt } }: Request, res: Response) {
    await authService.logout(jwt);
    res.clearCookie("jwt", authService.config.cookieOptions);
    res.jsonStatus(204);
  }
}
