import { RequestHandler } from "express";
import authService from "../services/auth.service.js";
import { ValidatedHandler } from "../types/types.js";
import * as validate from "../utils/validate.js";

class AuthController {
  login: ValidatedHandler = [
    validate.userEmailOnLogin,
    validate.userPassword,
    validate.sendErrorsIfExist,
    async ({ body }, res) => {
      const { accessToken, refreshToken } = await authService.login(body);
      res.cookie("jwt", refreshToken, authService.config.cookieOptions);
      res.json({ token: accessToken });
    },
  ];

  refresh: RequestHandler = async ({ cookies: { jwt } }, res) => {
    const { accessToken, refreshToken } = await authService.refresh(jwt);
    res.cookie("jwt", refreshToken, authService.config.cookieOptions);
    res.json({ token: accessToken });
  };

  logout: RequestHandler = async ({ cookies: { jwt } }, res) => {
    await authService.logout(jwt);
    res.clearCookie("jwt", authService.config.cookieOptions);
    res.jsonStatus(204);
  };
}

export default new AuthController();
